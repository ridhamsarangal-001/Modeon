import { useState, useEffect } from 'react';

/**
 * Reusable hook to safely render values from a persisted Zustand store,
 * avoiding hydration mismatch errors between server and client.
 * Uses setTimeout to schedule the state change and prevent synchronous
 * cascading render lint errors.
 */
export function useHydratedStore<T, F>(
  storeHook: (selector: (state: T) => F) => F,
  selector: (state: T) => F
): F | undefined {
  const storeValue = storeHook(selector);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setTimeout(() => {
      if (isMounted) {
        setHydrated(true);
      }
    }, 0);
    return () => {
      isMounted = false;
    };
  }, []);

  return hydrated ? storeValue : undefined;
}
