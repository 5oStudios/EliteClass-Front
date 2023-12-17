export function getLayoutDirection(locale: string | undefined) {
    if (!locale) return 'ltr';
    const rtlLanguages = ['ar-kw'];
    return rtlLanguages.includes(locale) ? 'rtl' : 'ltr';
  }
  