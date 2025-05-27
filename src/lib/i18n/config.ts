import { createI18nServer } from 'next-international/server';
import { createI18nClient } from 'next-international/client';

export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];

const i18n = {
  en: () => import('./locales/en'),
  es: () => import('./locales/es'),
};

export const { getI18n, getScopedI18n, getStaticParams } = createI18nServer(i18n);
export const { useI18n, useScopedI18n, useCurrentLocale, useChangeLocale } = createI18nClient(i18n); 