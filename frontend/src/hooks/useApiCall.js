import { useState } from 'react';

export function useApiCall() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeCall = async (apiFunction, ...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);
      return result;
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      throw err; // Re-throw so calling code can handle it
    } finally {
      setLoading(false);
    }
  };

  return { makeCall, loading, error, setError };
}