const { renderBusinessContext, extractCommonFields, renderCommonInputLines, buildMessages } = require('./_shared');

function build(input) {
  const f = extractCommonFields(input);

  const systemPrompt = `You are an expert SEO copywriter who writes meta descriptions that improve click-through rate from search results. You write in ${f.language}. Descriptions must stay under 160 characters and include a natural call to action. Return only ready-to-use content.`;

  const userPrompt = `
Write SEO meta descriptions for a page about: ${f.topic}

${renderCommonInputLines(f)}

${renderBusinessContext(f.businessProfile, f.tone, f.targetAudience)}

Return the response in this exact structure:

PRIMARY_DESCRIPTION:
<the best meta description, under 160 characters, includes the primary keyword and a call to action>

ALTERNATIVES:
<2 alternative meta descriptions, one per line, each under 160 characters>
`;

  return buildMessages(systemPrompt, userPrompt);
}

module.exports = { build };
