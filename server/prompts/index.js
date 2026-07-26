/**
 * Maps each contentType slug (as sent by the frontend / stored on
 * Generation.contentType) to its prompt builder module. This is the
 * only place that needs updating when a new content type is added —
 * everything else (route, controller, service) is generic.
 */
const registry = {
  instagram: require('./instagram.prompt'),
  facebook: require('./facebook.prompt'),
  linkedin: require('./linkedin.prompt'),
  twitter: require('./twitter.prompt'),
  whatsapp: require('./whatsapp.prompt'),
  'google-business': require('./googleBusiness.prompt'),
  'product-description': require('./productDescription.prompt'),
  'seo-meta-title': require('./seoMetaTitle.prompt'),
  'seo-meta-description': require('./seoMetaDescription.prompt'),
  'seo-keywords': require('./seoKeywords.prompt'),
  'blog-article': require('./blogArticle.prompt'),
  'email-campaign': require('./emailCampaign.prompt'),
  'promotional-sms': require('./promotionalSms.prompt'),
  'youtube-title': require('./youtubeTitle.prompt'),
  'youtube-description': require('./youtubeDescription.prompt'),
  'shorts-script': require('./shortsScript.prompt'),
  'ad-copy': require('./adCopy.prompt'),
  'festival-greeting': require('./festivalGreeting.prompt'),
  'review-reply': require('./reviewReply.prompt'),
  'business-tagline': require('./businessTagline.prompt'),
  'marketing-ideas': require('./marketingIdeas.prompt'),
  'cta-suggestions': require('./ctaSuggestions.prompt'),
  'image-prompt': require('./imagePrompt.prompt'),
  'video-prompt': require('./videoPrompt.prompt'),
};

function getPromptBuilder(contentType) {
  return registry[contentType] || null;
}

function getSupportedContentTypes() {
  return Object.keys(registry);
}

module.exports = { getPromptBuilder, getSupportedContentTypes };
