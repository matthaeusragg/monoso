import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';


export function useAsyncStorageState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        // await AsyncStorage.removeItem('categories');
        const stored = await AsyncStorage.getItem(key);
        if (stored !== null) {
          setState(JSON.parse(stored));
        }
      } catch (e) {
        console.error(`AsyncStorage read error for ${key}:`, e);
      } finally {
        setIsHydrated(true);
      }
    })();
  }, [key]);

  // Wrapped setter that also writes to storage
  const setPersistedState = useCallback(
    async (value: T | ((prev: T) => T)) => {
      setState((prev) => {
        const next = typeof value === "function" ? (value as any)(prev) : value;
        if(!isHydrated) {
         console.error(`State for ${key} not hydrated yet: Existing data potentially overwritten in AsyncStorage`);
        }
        AsyncStorage.setItem(key, JSON.stringify(next)).catch((e) =>
          {throw new Error(`AsyncStorage write error for ${key}:`, e);}
        );

        return next;
      });
    },
    [key, isHydrated]
  );

  return [state, setPersistedState, isHydrated] as const;
}
