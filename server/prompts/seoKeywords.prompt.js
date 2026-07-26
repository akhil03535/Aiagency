const { renderBusinessContext, extractCommonFields, renderCommonInputLines, buildMessages } = require('./_shared');

function build(input) {
  const f = extractCommonFields(input);

  const systemPrompt = `You are an expert SEO strategist who researches and suggests high-intent keywords for a given topic and business. You write in ${f.language}. Return only ready-to-use content, no explanations of your process.`;

  const userPrompt = `
Suggest SEO keywords for a page/business about: ${f.topic}

${renderCommonInputLines(f)}

${renderBusinessContext(f.businessProfile, f.tone, f.targetAudience)}

Return the response in this exact structure:

PRIMARY_KEYWORDS:
<5 high-intent primary keywords, one per line>

LONG_TAIL_KEYWORDS:
<8 long-tail keyword phrases, one per line>

LOCAL_KEYWORDS:
<3 location-based keyword variations if a location was provided, otherwise 3 general local-intent variations, one per line>
`;

  return buildMessages(systemPrompt, userPrompt);
}

module.exports = { build };
