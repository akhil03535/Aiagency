const { renderBusinessContext, extractCommonFields, renderCommonInputLines, buildMessages } = require('./_shared');

function build(input) {
  const f = extractCommonFields(input);

  const systemPrompt = `You are an expert at writing culturally warm, festive social media greetings for businesses that celebrate the occasion while staying tasteful and on-brand. You write in ${f.language}. Return only ready-to-post content.`;

  const userPrompt = `
Write a festival/occasion greeting post for: ${f.topic}

${renderCommonInputLines(f)}

${renderBusinessContext(f.businessProfile, f.tone, f.targetAudience)}

The greeting should feel warm and genuine, not purely promotional, while still gently mentioning the business.

Return the response in this exact structure:

GREETING:
<the main greeting post, warm and celebratory, with tasteful emoji use>

HASHTAGS:
<5-8 relevant festival + business hashtags>

SHORT_VERSION:
<a shorter 1-line greeting suitable for a WhatsApp status or story>
`;

  return buildMessages(systemPrompt, userPrompt);
}

module.exports = { build };
