/**
 * Prompt builder for Instagram post generation.
 */
const { renderBusinessContext, extractCommonFields, renderCommonInputLines, buildMessages } = require('./_shared');

function build(input) {
  const f = extractCommonFields(input);

  const systemPrompt = `You are an expert social media copywriter specializing in Instagram content that drives engagement and conversions. You write in ${f.language}. You always return well-structured, ready-to-post content — never meta commentary about what you're doing.`;

  const userPrompt = `
Write an Instagram post about: ${f.topic}

${renderCommonInputLines(f)}

${renderBusinessContext(f.businessProfile, f.tone, f.targetAudience)}

Return the response in this exact structure:

CAPTION:
<the main Instagram caption, using line breaks and emojis naturally>

HASHTAGS:
<10-15 relevant hashtags, space separated, no numbering>

SHORT_VERSION:
<a punchier 1-2 sentence version of the caption>
`;

  return buildMessages(systemPrompt, userPrompt);
}

module.exports = { build };
