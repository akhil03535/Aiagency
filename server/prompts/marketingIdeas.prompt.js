const { renderBusinessContext, extractCommonFields, renderCommonInputLines, buildMessages } = require('./_shared');

function build(input) {
  const f = extractCommonFields(input);

  const systemPrompt = `You are an expert marketing strategist who brainstorms practical, actionable campaign ideas for small and medium businesses. You write in ${f.language}. Return only ready-to-use content, no generic filler.`;

  const userPrompt = `
Brainstorm marketing ideas for: ${f.topic}

${renderCommonInputLines(f)}

${renderBusinessContext(f.businessProfile, f.tone, f.targetAudience)}

Return the response in this exact structure:

IDEAS:
<5 distinct, specific marketing campaign ideas, one per line, each 1-2 sentences describing the idea and why it would work>

QUICK_WINS:
<3 low-effort ideas that could be executed this week, one per line>
`;

  return buildMessages(systemPrompt, userPrompt);
}

module.exports = { build };
