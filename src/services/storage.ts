const exists = (key: string) => localStorage.getItem(key) != null;
const load = <T = string>(key: string) => {
   let value = localStorage.getItem(key);
   if (value) return JSON.parse(value) as T;
};
const save = <T>(key: string, value: T) => {
   localStorage.setItem(key, JSON.stringify(value));
   return load(key) as T;
};

const useStorage = () => ({ load, save, exists });

export default useStorage;
