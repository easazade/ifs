export const SEGMENTS = Object.freeze({
  PROTOCOL: 'protocol',
  WELCOME: 'welcome',
  ABOUT: 'about',
  HOW_IT_WORKS: 'how-it-works',
  FAQ: 'faq',
});

export const ROUTES = Object.freeze({
  INDEX: '/',
  WELCOME: `/${SEGMENTS.WELCOME}`,
  PROTOCOL: `/${SEGMENTS.PROTOCOL}`,
  HOW_IT_WORKS: `/${SEGMENTS.HOW_IT_WORKS}`,
  PROTOCOL_DETAIL: (id: string) => `/${SEGMENTS.PROTOCOL}/${id}`,
  ABOUT: `/${SEGMENTS.ABOUT}`,
  FAQ: `/${SEGMENTS.FAQ}`,
});
