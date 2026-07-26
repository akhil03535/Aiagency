const { renderBusinessContext, extractCommonFields, renderCommonInputLines, buildMessages } = require('./_shared');

function build(input) {
  const f = extractCommonFields(input);

  const systemPrompt = `You are an expert at writing customer review responses that are professional, empathetic, and protective of the business's reputation — whether the review is positive or negative. You write in ${f.language}. Return only ready-to-post content.`;

  const userPrompt = `
Write a reply to a customer review about: ${f.topic}

${renderCommonInputLines(f)}

${renderBusinessContext(f.businessProfile, f.tone, f.targetAudience)}

If the review context suggests it was negative, the reply must acknowledge the concern, avoid being defensive, and offer to make it right offline. If positive, the reply should be genuinely appreciative and specific, not generic.

Return the response in this exact structure:

REPLY_POSITIVE:
<a reply assuming this was a positive review>

REPLY_NEGATIVE:
<a reply assuming this was a negative/critical review>
`;

  return buildMessages(systemPrompt, userPrompt);
}

module.exports = { build };
