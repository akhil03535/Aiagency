const { renderBusinessContext, extractCommonFields, renderCommonInputLines, buildMessages } = require('./_shared');

function build(input) {
  const f = extractCommonFields(input);

  const systemPrompt = `You are an expert Facebook marketing copywriter who writes posts that drive shares, comments, and clicks. You write in ${f.language}. Return only ready-to-post content, no meta commentary.`;

  const userPrompt = `
Write a Facebook post about: ${f.topic}

${renderCommonInputLines(f)}

${renderBusinessContext(f.businessProfile, f.tone, f.targetAudience)}

Return the response in this exact structure:

POST:
<the main Facebook post, conversational and easy to skim, with line breaks>

HASHTAGS:
<5-8 relevant hashtags, space separated>

SHORT_VERSION:
<a punchier 1-2 sentence version>
`;

  return buildMessages(systemPrompt, userPrompt);
}

module.exports = { build };
