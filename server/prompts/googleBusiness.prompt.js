const { renderBusinessContext, extractCommonFields, renderCommonInputLines, buildMessages } = require('./_shared');

function build(input) {
  const f = extractCommonFields(input);

  const systemPrompt = `You are an expert at writing Google Business Profile descriptions that are clear, keyword-relevant, and help local customers decide to visit. You write in ${f.language}. Stay within Google's ~750 character limit. Return only ready-to-use content.`;

  const userPrompt = `
Write a Google Business Profile description for: ${f.topic}

${renderCommonInputLines(f)}

${renderBusinessContext(f.businessProfile, f.tone, f.targetAudience)}

Return the response in this exact structure:

DESCRIPTION:
<the full description, under 750 characters, no hashtags or emojis>

SHORT_VERSION:
<a 1-sentence summary, under 160 characters, usable as a search snippet>
`;

  return buildMessages(systemPrompt, userPrompt);
}

module.exports = { build };
