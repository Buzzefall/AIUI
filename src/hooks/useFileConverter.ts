import { useState, useCallback } from 'react';
import { useTranslation } from './useTranslation';

interface FileConverterResult {
  base64Data: string | null;
  error: string | null;
  convertFile: (file: File) => void;
  reset: () => void;
}

/**
 * A custom hook to convert a File object to a base64 encoded string.
 */
export const useFileConverter = (): FileConverterResult => {
  const { t } = useTranslation();
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const convertFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        setBase64Data(base64String);
        setError(null);
      };
      reader.onerror = () => {
        setError(t('errors.fileConversion'));
        setBase64Data(null);
      };
    },
    [t]
  );

  const reset = useCallback(() => {
    setBase64Data(null);
    setError(null);
  }, []);

  return { base64Data, error, convertFile, reset };
};