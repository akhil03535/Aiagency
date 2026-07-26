const { renderBusinessContext, extractCommonFields, renderCommonInputLines, buildMessages } = require('./_shared');

function build(input) {
  const f = extractCommonFields(input);

  const systemPrompt = `You are an expert at writing prompts for AI image generation tools (like Midjourney, DALL-E, Stable Diffusion) that produce professional marketing visuals. You write in ${f.language}. Return only ready-to-use prompts, no explanations.`;

  const userPrompt = `
Write an AI image generation prompt for: ${f.topic}

${renderCommonInputLines(f)}

${renderBusinessContext(f.businessProfile, f.tone, f.targetAudience)}

Return the response in this exact structure:

PRIMARY_PROMPT:
<a detailed image prompt describing subject, style, lighting, composition, and mood — written as a single descriptive paragraph>

STYLE_VARIANTS:
<3 short variations of the prompt, one per line, each testing a different visual style (e.g. photorealistic, illustrated, minimalist)>

NEGATIVE_PROMPT:
<comma-separated list of things to avoid in the image, e.g. text, watermarks, blurry, distorted>
`;

  return buildMessages(systemPrompt, userPrompt);
}

module.exports = { build };
