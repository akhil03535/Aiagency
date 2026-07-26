const { renderBusinessContext, extractCommonFields, renderCommonInputLines, buildMessages } = require('./_shared');

function build(input) {
  const f = extractCommonFields(input);

  const systemPrompt = `You are an expert at writing prompts for AI video generation tools (like Sora, Runway, Pika) that produce professional marketing video clips. You write in ${f.language}. Return only ready-to-use prompts, no explanations.`;

  const userPrompt = `
Write an AI video generation prompt for: ${f.topic}

${renderCommonInputLines(f)}

${renderBusinessContext(f.businessProfile, f.tone, f.targetAudience)}

Return the response in this exact structure:

PRIMARY_PROMPT:
<a detailed video prompt describing scene, camera movement, subject action, lighting, and pacing — written as a single descriptive paragraph, target 5-10 seconds of footage>

STYLE_VARIANTS:
<3 short variations of the prompt, one per line, each testing a different visual/camera style>

SCENE_BREAKDOWN:
<a 3-shot breakdown, one line per shot, describing what happens in each>
`;

  return buildMessages(systemPrompt, userPrompt);
}

module.exports = { build };
