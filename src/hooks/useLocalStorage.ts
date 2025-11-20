export const useLocalStorage = (key: string) => {
  const getValue = () => {
    if (typeof window === 'undefined') return null;
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  };

  const setValue = (value: any) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  };

  return [getValue, setValue] as const;
};