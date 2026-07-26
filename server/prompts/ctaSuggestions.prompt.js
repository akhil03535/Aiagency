const { renderBusinessContext, extractCommonFields, renderCommonInputLines, buildMessages } = require('./_shared');

function build(input) {
  const f = extractCommonFields(input);

  const systemPrompt = `You are an expert conversion copywriter who writes calls-to-action that create urgency and clarity without sounding pushy. You write in ${f.language}. Return only ready-to-use content.`;

  const userPrompt = `
Suggest calls-to-action for: ${f.topic}

${renderCommonInputLines(f)}

${renderBusinessContext(f.businessProfile, f.tone, f.targetAudience)}

Return the response in this exact structure:

BUTTON_CTAS:
<6 short button-style CTAs (2-4 words each), one per line>

SENTENCE_CTAS:
<4 full-sentence CTAs suitable for the end of a post or email, one per line>
`;

  return buildMessages(systemPrompt, userPrompt);
}

module.exports = { build };
