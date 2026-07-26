const { renderBusinessContext, extractCommonFields, renderCommonInputLines, buildMessages } = require('./_shared');

function build(input) {
  const f = extractCommonFields(input);

  const systemPrompt = `You are an expert at writing WhatsApp broadcast promotional messages for small businesses. You write in ${f.language}. Messages should feel personal and direct, not spammy. Return only ready-to-send content.`;

  const userPrompt = `
Write a WhatsApp promotional broadcast message about: ${f.topic}

${renderCommonInputLines(f)}

${renderBusinessContext(f.businessProfile, f.tone, f.targetAudience)}

Keep it short enough to read in one glance on a phone screen. Use at most 2-3 emojis.

Return the response in this exact structure:

MESSAGE:
<the main WhatsApp message, 3-5 short lines>

SHORT_VERSION:
<a one-line version for a quick broadcast>
`;

  return buildMessages(systemPrompt, userPrompt);
}

module.exports = { build };
