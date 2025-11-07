import {
  TranslatedLanguages,
  TranslationKeys,
  Translations,
} from './data/languages';

const defaultLocale: TranslatedLanguages = 'en';
let locale: TranslatedLanguages | undefined;

function getBrowserLocale() {
  return navigator.language.split('-')[0];
}

function translateElement(element: Element) {
  if (!(element instanceof HTMLElement) || !locale) return;

  const prop = element.getAttribute('data-trans');

  if (prop) {
    const key = (element.getAttribute(prop) || '').trim();
    if (key && key in Translations[locale]) {
      element.setAttribute(prop, Translations[locale][key as TranslationKeys]);
    }
  } else {
    const key = element.innerText.trim();
    if (key && key in Translations[locale]) {
      element.innerText = Translations[locale][key as TranslationKeys];
    }
  }
}

function translatePage() {
  document.querySelectorAll('[data-trans]').forEach(translateElement);
}

function setLocale(newLocale: string) {
  if (newLocale === locale) return;

  document.documentElement.lang = newLocale;

  const newLocaleLower = newLocale.toLocaleLowerCase();

  locale =
    newLocaleLower in Translations
      ? (newLocaleLower as TranslatedLanguages)
      : defaultLocale;

  // Save to localStorage
  localStorage.setItem('mbr_locale', locale);

  translatePage();
}

function getLocale() {
  return locale;
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('localization loaded');

  // Check if user has a saved locale preference
  const savedLocale = localStorage.getItem('mbr_locale');
  const browserLocale = getBrowserLocale();

  console.log('detected locale: ', browserLocale);
  console.log('saved locale: ', savedLocale);

  setLocale(savedLocale || browserLocale);
});

// eslint-disable-next-line
(window as any).translateElement = translateElement;
// eslint-disable-next-line
(window as any).setLocale = setLocale;
// eslint-disable-next-line
(window as any).getLocale = getLocale;
