const { renderBusinessContext, extractCommonFields, renderCommonInputLines, buildMessages } = require('./_shared');

function build(input) {
  const f = extractCommonFields(input);

  const systemPrompt = `You are an expert YouTube SEO strategist who writes video descriptions that rank in search and keep viewers informed. You write in ${f.language}. Return only ready-to-use content.`;

  const userPrompt = `
Write a YouTube video description for a video about: ${f.topic}

${renderCommonInputLines(f)}

${renderBusinessContext(f.businessProfile, f.tone, f.targetAudience)}

Return the response in this exact structure:

DESCRIPTION:
<the full description — a strong 2-sentence hook in the first 125 characters (shown before "show more"), followed by more detail, naturally including keywords>

HASHTAGS:
<3-5 relevant hashtags for YouTube, space separated>

SUGGESTED_TAGS:
<8-10 comma-separated video tags for the YouTube tags field>
`;

  return buildMessages(systemPrompt, userPrompt);
}

module.exports = { build };
