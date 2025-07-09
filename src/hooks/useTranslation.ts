import { getTranslation } from '../utils/getTranslation';
import { useAppSelector } from '../state/hooks';
import { selectLocale } from '../state/localeSlice';
import { useCallback } from 'react';

export const useTranslation = () => {
  const locale = useAppSelector(selectLocale);

  const t = useCallback(
    (key: string, options?: { [key: string]: string | number }): string => {
      return getTranslation(locale, key, options);
    },
    [locale]
  );

  return { t };
};