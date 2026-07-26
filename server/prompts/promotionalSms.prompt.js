const { renderBusinessContext, extractCommonFields, renderCommonInputLines, buildMessages } = require('./_shared');

function build(input) {
  const f = extractCommonFields(input);

  const systemPrompt = `You are an expert at writing promotional SMS messages that drive immediate action within strict length limits. You write in ${f.language}. Return only ready-to-send content.`;

  const userPrompt = `
Write a promotional SMS message about: ${f.topic}

${renderCommonInputLines(f)}

${renderBusinessContext(f.businessProfile, f.tone, f.targetAudience)}

The main message must be under 160 characters (standard single SMS length). No emojis.

Return the response in this exact structure:

MESSAGE:
<the SMS message, under 160 characters, includes a clear CTA>

SHORT_VERSION:
<an even shorter version, under 100 characters>
`;

  return buildMessages(systemPrompt, userPrompt);
}

module.exports = { build };
