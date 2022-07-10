export const addProp = <R, T>(obj: Object, key: string, value: T) => {
   Object.defineProperty(obj, key, { value: value });
   return obj as R;
};

export const delay = async (ms: number) => {
   // return await for better async stack trace support in case of errors.
   return await new Promise(resolve => setTimeout(resolve, ms));
};
