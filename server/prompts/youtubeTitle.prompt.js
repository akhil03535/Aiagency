const { renderBusinessContext, extractCommonFields, renderCommonInputLines, buildMessages } = require('./_shared');

function build(input) {
  const f = extractCommonFields(input);

  const systemPrompt = `You are an expert YouTube strategist who writes titles that maximize click-through rate while staying accurate to the content. You write in ${f.language}. Return only ready-to-use content.`;

  const userPrompt = `
Write YouTube video titles for a video about: ${f.topic}

${renderCommonInputLines(f)}

${renderBusinessContext(f.businessProfile, f.tone, f.targetAudience)}

Titles should stay under 70 characters so they don't get cut off in search results.

Return the response in this exact structure:

PRIMARY_TITLE:
<the best title, under 70 characters>

ALTERNATIVES:
<5 alternative titles, one per line, each under 70 characters, testing different angles (curiosity, benefit, how-to, listicle, question)>
`;

  return buildMessages(systemPrompt, userPrompt);
}

module.exports = { build };
