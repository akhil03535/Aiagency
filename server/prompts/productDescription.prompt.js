const { renderBusinessContext, extractCommonFields, renderCommonInputLines, buildMessages } = require('./_shared');

function build(input) {
  const f = extractCommonFields(input);

  const systemPrompt = `You are an expert ecommerce copywriter who writes product descriptions that convert browsers into buyers by focusing on benefits, not just features. You write in ${f.language}. Return only ready-to-use content.`;

  const userPrompt = `
Write a product description for: ${f.topic}

${renderCommonInputLines(f)}

${renderBusinessContext(f.businessProfile, f.tone, f.targetAudience)}

Return the response in this exact structure:

DESCRIPTION:
<the full product description, benefit-led, scannable with short paragraphs or bullet-style lines>

SHORT_VERSION:
<a 1-2 sentence version for a product card or thumbnail listing>

BULLET_FEATURES:
<3-5 short bullet points of key features/benefits, one per line, no bullet symbol needed>
`;

  return buildMessages(systemPrompt, userPrompt);
}

module.exports = { build };
