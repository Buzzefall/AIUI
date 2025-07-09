import { useAppDispatch, useAppSelector } from '../state/hooks';
import { Locale, selectLocale, setLocale } from '../state/localeSlice';

export const LocaleSwitcher = () => {
  const dispatch = useAppDispatch();
  const currentLocale = useAppSelector(selectLocale);
  const locales: Locale[] = ['en', 'ru'];

  return (
    <div className="flex justify-center items-center gap-2">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => dispatch(setLocale(locale))}
          className={`px-2 py-0.5 rounded-md text-xs font-semibold transition-colors ${
            currentLocale === locale
              ? 'bg-primary/20 text-primary-dark'
              : 'text-slate-500 hover:bg-slate-200'
          }`}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
};