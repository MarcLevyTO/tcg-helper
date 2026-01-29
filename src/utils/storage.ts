export const createStorageAccessor = <T>(key: string) => {
  const getValue = (): T | null => {
    if (typeof window === 'undefined') return null;
    const storedValue = localStorage.getItem(key);
    try {
      return storedValue ? (JSON.parse(storedValue) as T) : null;
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}":`, error);
      return null;
    }
  };

  const setValue = (value: T) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [getValue, setValue] as const;
};
