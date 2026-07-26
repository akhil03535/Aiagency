const { renderBusinessContext, extractCommonFields, renderCommonInputLines, buildMessages } = require('./_shared');

function build(input) {
  const f = extractCommonFields(input);

  const systemPrompt = `You are an expert SEO copywriter who writes meta titles that rank well and earn clicks in search results. You write in ${f.language}. Titles must stay under 60 characters. Return only ready-to-use content.`;

  const userPrompt = `
Write SEO meta titles for a page about: ${f.topic}

${renderCommonInputLines(f)}

${renderBusinessContext(f.businessProfile, f.tone, f.targetAudience)}

Return the response in this exact structure:

PRIMARY_TITLE:
<the best meta title, under 60 characters, includes the primary keyword near the start>

ALTERNATIVES:
<4 alternative meta titles, one per line, each under 60 characters>
`;

  return buildMessages(systemPrompt, userPrompt);
}

module.exports = { build };
