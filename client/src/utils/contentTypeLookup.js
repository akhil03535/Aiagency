import { CONTENT_TYPES } from './contentTypes.js';

const byslug = Object.fromEntries(CONTENT_TYPES.map((t) => [t.slug, t]));

export function getContentTypeMeta(slug) {
  return byslug[slug] || { label: slug, icon: CONTENT_TYPES[0].icon, category: 'Other' };
}
