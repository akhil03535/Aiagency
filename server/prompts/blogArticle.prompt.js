const { renderBusinessContext, extractCommonFields, renderCommonInputLines, buildMessages } = require('./_shared');

function build(input) {
  const f = extractCommonFields(input);

  const systemPrompt = `You are an expert content writer who writes engaging, well-structured blog articles optimized for both readers and search engines. You write in ${f.language}. Use clear headings and short paragraphs. Return only ready-to-publish content.`;

  const userPrompt = `
Write a blog article about: ${f.topic}

${renderCommonInputLines(f)}

${renderBusinessContext(f.businessProfile, f.tone, f.targetAudience)}

Length guide: short = ~300 words, medium = ~600 words, long = ~1000 words.

Return the response in this exact structure:

TITLE:
<an engaging, SEO-friendly blog title>

ARTICLE:
<the full article using Markdown headings (##) for sections, short paragraphs, and a natural conclusion with a call to action>

META_DESCRIPTION:
<a 1-sentence SEO meta description for this article, under 160 characters>
`;

  return buildMessages(systemPrompt, userPrompt);
}

module.exports = { build };
