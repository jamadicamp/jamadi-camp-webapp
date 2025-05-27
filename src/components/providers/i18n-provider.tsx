'use client';

import { createI18nClient } from 'next-international/client';
import { PropsWithChildren } from 'react';

const { I18nProviderClient } = createI18nClient({
  en: () => import('@/lib/i18n/locales/en'),
  es: () => import('@/lib/i18n/locales/es'),
});

interface I18nProviderProps extends PropsWithChildren {
  locale: string;
}

export function I18nProvider({ children, locale }: I18nProviderProps) {
  return <I18nProviderClient locale={locale}>{children}</I18nProviderClient>;
}

export const { useI18n, useScopedI18n, useCurrentLocale, useChangeLocale } = createI18nClient({
  en: () => import('@/lib/i18n/locales/en'),
  es: () => import('@/lib/i18n/locales/es'),
}); 