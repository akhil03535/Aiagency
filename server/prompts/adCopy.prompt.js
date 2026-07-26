const { renderBusinessContext, extractCommonFields, renderCommonInputLines, buildMessages } = require('./_shared');

function build(input) {
  const f = extractCommonFields(input);

  const systemPrompt = `You are an expert paid-ads copywriter (Google Ads, Meta Ads) who writes copy optimized for conversions, not just impressions. You write in ${f.language}. Return only ready-to-use content.`;

  const userPrompt = `
Write ad copy for a paid campaign about: ${f.topic}

${renderCommonInputLines(f)}

${renderBusinessContext(f.businessProfile, f.tone, f.targetAudience)}

Return the response in this exact structure:

HEADLINE:
<primary headline, under 30 characters if possible>

HEADLINE_ALTERNATIVES:
<3 alternative headlines, one per line, under 30 characters each>

PRIMARY_TEXT:
<the main ad body text, under 125 characters, benefit-focused with urgency>

DESCRIPTION:
<a secondary description line, under 30 characters>

CTA_BUTTON:
<a single suggested call-to-action button label, e.g. "Shop Now", "Book Today">
`;

  return buildMessages(systemPrompt, userPrompt);
}

module.exports = { build };
