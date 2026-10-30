export const supportedLanguages = ['en','hi','or','bn','ta','te'] as const;
export type SupportedLanguage = typeof supportedLanguages[number];
export const messages = { en: { appName: 'Suraksha', signIn: 'Sign in' }, hi: { appName: 'सुरक्षा', signIn: 'साइन इन करें' }, or: { appName: 'ସୁରକ୍ଷା', signIn: 'ସାଇନ୍ ଇନ୍' }, bn: { appName: 'সুরক্ষা', signIn: 'সাইন ইন' }, ta: { appName: 'பாதுகாப்பு', signIn: 'உள்நுழைக' }, te: { appName: 'సురక్ష', signIn: 'సైన్ ఇన్' } } satisfies Record<SupportedLanguage, {appName:string;signIn:string}>;

export const languageNames: Record<SupportedLanguage, string> = {
  en: 'English',
  hi: 'हिंदी (Hindi)',
  or: 'ଓଡ଼ିଆ (Odia)',
  bn: 'বাংলা (Bengali)',
  ta: 'தமிழ் (Tamil)',
  te: 'తెలుగు (Telugu)',
};
