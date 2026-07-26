const { renderBusinessContext, extractCommonFields, renderCommonInputLines, buildMessages } = require('./_shared');

function build(input) {
  const f = extractCommonFields(input);

  const systemPrompt = `You are an expert LinkedIn content strategist who writes posts that build professional credibility and drive meaningful engagement. You write in ${f.language}. Avoid clickbait and excessive emoji. Return only ready-to-post content.`;

  const userPrompt = `
Write a LinkedIn post about: ${f.topic}

${renderCommonInputLines(f)}

${renderBusinessContext(f.businessProfile, f.tone, f.targetAudience)}

Return the response in this exact structure:

POST:
<the main LinkedIn post — professional, credible, uses short paragraphs and line breaks for readability>

HASHTAGS:
<3-5 relevant professional hashtags>

SHORT_VERSION:
<a punchier 1-2 sentence version>
`;

  return buildMessages(systemPrompt, userPrompt);
}

module.exports = { build };
