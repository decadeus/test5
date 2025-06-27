import {getRequestConfig} from 'next-intl/server';

export const locales = ['en', 'fr', 'pl', 'de', 'ru', 'uk'];

export default getRequestConfig(async ({locale}) => {
  if (!locales.includes(locale as any)) throw new Error('Locale not found');
  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default
  };
}); 