export const addProp = <R, T>(obj: Object, key: string, value: T) => {
   Object.defineProperty(obj, key, { value: value });
   return obj as R;
};
