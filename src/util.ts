export const addProp = <R, T>(obj: Object, key: string, value: T) => {
   Object.defineProperty(obj, key, { value: value });
   return obj as R;
};

export const delay = async (ms: number) => {
   // return await for better async stack trace support in case of errors.
   return await new Promise(resolve => setTimeout(resolve, ms));
};

export const parseSecs = (totalSecs: number | string) => {
   let mins: number;
   let secs: number;

   if (typeof totalSecs === 'string') {
      secs = Number.parseInt(totalSecs);
   } else {
      secs = totalSecs;
   }

   if (secs >= 60) {
      mins = Math.floor(secs / 60);
      secs = secs - mins * 60;
   } else {
      mins = 0;
      secs = secs;
   }

   let secsStr = `${secs}`;

   if (secsStr.length == 1) secsStr = '0' + secsStr;

   return `${mins}:${secsStr}`;
};
