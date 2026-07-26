/**
 * Every prompt file asks the AI to return output using ALL_CAPS_LABEL:
 * section markers (e.g. CAPTION:, HASHTAGS:, SHORT_VERSION:). This parses
 * that convention into a structured object so the frontend can render
 * fields like "hashtags" and "short version" separately rather than
 * getting back one undifferentiated blob of text.
 */

/**
 * @param {string} rawText - the raw AI completion text
 * @returns {Object} keys are camelCase versions of the labels found,
 *   e.g. { caption: "...", hashtags: "...", shortVersion: "..." }
 *   plus a `raw` key with the untouched original text as a fallback.
 */
function parseStructuredOutput(rawText) {
  const sections = {};
  const labelPattern = /^([A-Z][A-Z0-9_]{2,}):\s*$/gm;

  const matches = [...rawText.matchAll(labelPattern)];

  if (matches.length === 0) {
    return { raw: rawText.trim() };
  }

  for (let i = 0; i < matches.length; i++) {
    const label = matches[i][1];
    const start = matches[i].index + matches[i][0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : rawText.length;
    const content = rawText.slice(start, end).trim();
    const key = toCamelCase(label);
    sections[key] = content;
  }

  sections.raw = rawText.trim();
  return sections;
}

function toCamelCase(label) {
  return label
    .toLowerCase()
    .split('_')
    .map((word, i) => (i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join('');
}

/**
 * Extracts a hashtags array from a parsed output object, if a hashtags
 * section exists. Handles space-separated "#tag #tag" format.
 */
function extractHashtags(parsed) {
  const source = parsed.hashtags;
  if (!source) return [];
  return source
    .split(/\s+/)
    .map((tag) => tag.trim())
    .filter((tag) => tag.startsWith('#'));
}

module.exports = { parseStructuredOutput, extractHashtags };
