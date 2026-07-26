/**
 * Shared helpers for prompt builders. Every prompts/*.prompt.js file still
 * exports its own `build(input)` — this just factors out the repetitive
 * parts (business context block, common input destructuring, output
 * structure section) so adding a new content type is a ~20-line config,
 * not a 70-line copy-paste.
 */

/**
 * Renders the optional saved-business-profile block that gets appended
 * to nearly every prompt so generations are personalized automatically.
 */
function renderBusinessContext(businessProfile, fallbackTone, fallbackAudience) {
  if (!businessProfile) return '';
  return `
Business context (use this to personalize the output, but don't repeat it verbatim):
- Business name: ${businessProfile.businessName}
- Business type: ${businessProfile.businessType || 'N/A'}
- Brand tone preference: ${businessProfile.brandTone || fallbackTone}
- Target audience: ${businessProfile.audience || fallbackAudience || 'general audience'}
- Products: ${(businessProfile.products || []).join(', ') || 'N/A'}
- Services: ${(businessProfile.services || []).join(', ') || 'N/A'}
- Description: ${businessProfile.description || 'N/A'}
`.trim();
}

/**
 * Pulls the common fields every generator form shares, with defaults.
 */
function extractCommonFields(input) {
  const {
    topic,
    goal,
    targetAudience,
    tone = 'PROFESSIONAL',
    length = 'medium',
    language = 'English',
    offer,
    keywords = [],
    callToAction,
    businessProfile,
  } = input;

  return { topic, goal, targetAudience, tone, length, language, offer, keywords, callToAction, businessProfile };
}

/**
 * Renders the shared "optional field" lines used in nearly every user prompt.
 */
function renderCommonInputLines({ goal, targetAudience, tone, length, offer, keywords, callToAction }) {
  return [
    goal ? `Goal: ${goal}` : '',
    targetAudience ? `Target audience: ${targetAudience}` : '',
    `Tone: ${tone}`,
    `Length: ${length}`,
    offer ? `Offer to highlight: ${offer}` : '',
    keywords.length ? `Keywords to naturally include: ${keywords.join(', ')}` : '',
    callToAction ? `Call to action: ${callToAction}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Builds the final chat message array. Every prompt file ultimately calls this.
 */
function buildMessages(systemPrompt, userPrompt) {
  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt.trim() },
  ];
}

module.exports = {
  renderBusinessContext,
  extractCommonFields,
  renderCommonInputLines,
  buildMessages,
};
