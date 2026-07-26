const { renderBusinessContext, extractCommonFields, renderCommonInputLines, buildMessages } = require('./_shared');

function build(input) {
  const f = extractCommonFields(input);

  const systemPrompt = `You are an expert X (Twitter) copywriter who writes punchy, high-engagement posts within the 280 character limit. You write in ${f.language}. Return only ready-to-post content.`;

  const userPrompt = `
Write an X (Twitter) post about: ${f.topic}

${renderCommonInputLines(f)}

${renderBusinessContext(f.businessProfile, f.tone, f.targetAudience)}

The main post must be under 280 characters including hashtags.

Return the response in this exact structure:

POST:
<the main post, under 280 characters>

HASHTAGS:
<2-3 relevant hashtags>

THREAD_VERSION:
<an optional 3-tweet thread expanding on the same topic, numbered 1/, 2/, 3/>
`;

  return buildMessages(systemPrompt, userPrompt);
}

module.exports = { build };
