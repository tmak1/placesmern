import { useState, useCallback } from 'react';

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const sendRequest = useCallback(
    async (url, method = 'GET', headers = {}, body = null, fileName = null) => {
      setIsLoading(true);
      let data;
      try {
        const res = await fetch(url, {
          method,
          headers,
          body,
        });
        data = !!fileName
          ? new File([await res.blob()], fileName)
          : await res.json();

        setIsLoading(false);
        if (!res.ok) {
          throw new Error(data.error.message);
        }
        return data;
      } catch (err) {
        setIsLoading(false);
        setError(err.message);
      }
    },
    []
  );
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  return { isLoading, error, sendRequest, clearError };
};
