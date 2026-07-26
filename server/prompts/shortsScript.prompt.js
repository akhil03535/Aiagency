const { renderBusinessContext, extractCommonFields, renderCommonInputLines, buildMessages } = require('./_shared');

function build(input) {
  const f = extractCommonFields(input);

  const systemPrompt = `You are an expert short-form video scriptwriter (Instagram Reels, YouTube Shorts, TikTok) who writes scripts optimized to hook viewers in the first 2 seconds and hold attention. You write in ${f.language}. Return only ready-to-shoot content.`;

  const userPrompt = `
Write a short-form video script (Reels/Shorts) about: ${f.topic}

${renderCommonInputLines(f)}

${renderBusinessContext(f.businessProfile, f.tone, f.targetAudience)}

Target length: 20-45 seconds when spoken aloud.

Return the response in this exact structure:

HOOK:
<the first line, spoken in the first 1-2 seconds, designed to stop the scroll>

SCRIPT:
<the full script broken into short beats, each on its own line, formatted as "[Beat description] Spoken line">

CAPTION:
<a short on-screen caption/title text overlay suggestion>

HASHTAGS:
<5-8 relevant hashtags>
`;

  return buildMessages(systemPrompt, userPrompt);
}

module.exports = { build };
