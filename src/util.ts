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

/**
 * @copyright https://rosettacode.org/wiki/Map_range
 * @returns linearly mapped value from range A to range B
 */
export const mapValue = (
   rangeA: [min: number, max: number],
   rangeB: [min: number, max: number],
   value: number
): number => {
   let [a1, a2] = rangeA;
   let [b1, b2] = rangeB;
   return b1 + ((value - a1) * (b2 - b1)) / (a2 - a1);
};

export const recordLength = <T extends string | number | symbol>(
   record: Record<T, any>
) => {
   let count = 0;
   for (const key in record) {
      if (Object.prototype.hasOwnProperty.call(record, key)) count++;
   }
   return count;
};

export const wholeDivide = (
   dividend: number,
   divisor: number
): [quotient: number, remainder: number] => {
   let quotient = Math.floor(dividend / divisor);
   let remainder = dividend - quotient * divisor;

   return [quotient, remainder];
};

export const isNumeric = (str: string) => /^-?\d+$/.test(str);
