'use client';

import { useState } from 'react';

export function useAsyncAction<T>(
  action: (data: T) => Promise<void>,
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (data: T) => {
    setIsLoading(true);
    setError(null);

    try {
      await action(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { execute, isLoading, error };
}
