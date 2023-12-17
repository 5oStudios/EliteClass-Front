export function getDirection(locale: string | undefined) {
  if (!locale) return 'ltr';
  const rtlLanguages = ['ar'];
  return rtlLanguages.includes(locale) ? 'rtl' : 'ltr';
}

export const getDir = () => {
  if (typeof window !== 'undefined') {
    const lang = localStorage.getItem('lang');
    return lang === 'en-us' ? 'ltr' : 'rtl';
  }
  return 'ltr';
};
