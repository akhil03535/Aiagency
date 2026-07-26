const { renderBusinessContext, extractCommonFields, renderCommonInputLines, buildMessages } = require('./_shared');

function build(input) {
  const f = extractCommonFields(input);

  const systemPrompt = `You are an expert brand strategist who writes short, memorable taglines that capture a business's essence in a few words. You write in ${f.language}. Return only ready-to-use content.`;

  const userPrompt = `
Write taglines for: ${f.topic}

${renderCommonInputLines(f)}

${renderBusinessContext(f.businessProfile, f.tone, f.targetAudience)}

Taglines should be short — ideally under 8 words each.

Return the response in this exact structure:

PRIMARY_TAGLINE:
<the single best tagline>

ALTERNATIVES:
<6 alternative taglines, one per line, testing different angles (benefit, emotion, wordplay, promise, identity, action)>
`;

  return buildMessages(systemPrompt, userPrompt);
}

module.exports = { build };
