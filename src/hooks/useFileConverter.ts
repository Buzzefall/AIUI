import { useState, useCallback } from 'react';

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
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const convertFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      setBase64Data(result.split(',')[1]);
    };
    reader.onerror = () => {
      setError('Error converting file to base64.');
    };
  }, []);

  const reset = useCallback(() => {
    setBase64Data(null);
    setError(null);
  }, []);

  return { base64Data, error, convertFile, reset };
};