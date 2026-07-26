const { renderBusinessContext, extractCommonFields, renderCommonInputLines, buildMessages } = require('./_shared');

function build(input) {
  const f = extractCommonFields(input);

  const systemPrompt = `You are an expert email marketing copywriter who writes campaigns with high open and click-through rates. You write in ${f.language}. Return only ready-to-send content.`;

  const userPrompt = `
Write a marketing email campaign about: ${f.topic}

${renderCommonInputLines(f)}

${renderBusinessContext(f.businessProfile, f.tone, f.targetAudience)}

Return the response in this exact structure:

SUBJECT_LINE:
<a compelling subject line under 60 characters>

PREVIEW_TEXT:
<the preview/preheader text shown next to the subject line, under 90 characters>

BODY:
<the full email body with a greeting, a short engaging opener, the main message, and a clear call to action. Use line breaks between paragraphs.>

ALTERNATIVE_SUBJECT_LINES:
<3 alternative subject lines, one per line>
`;

  return buildMessages(systemPrompt, userPrompt);
}

module.exports = { build };
