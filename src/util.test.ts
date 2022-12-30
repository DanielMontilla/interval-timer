import { isWithIn, modDiv, parseMiliseconds } from "@/util";
import { expect, test } from 'vitest'

test('isWithIn', () => {
  expect(isWithIn(1, { min: 1, max: 3, inclusive: true})).toBe(true);
  expect(isWithIn(1, { min: 1, max: 3, inclusive: false})).toBe(false);
  expect(isWithIn(0, { min: 1, max: 3})).toBe(false);
})

test('duration stuff', () => {
  expect(modDiv(26, 5)).toStrictEqual({ quotient: 5, remainder: 1});
  
  const milisecond = 1;
  const second = milisecond * 1000;
  const minute = second * 60;
  const hour = minute * 60;
  
  const ctx = (hours: number, minutes: number, seconds: number, miliseconds: number) => {
    const duration = (hours * hour) + (minutes * minute) + (seconds * second) + (miliseconds * milisecond);
    const res = parseMiliseconds(duration);
    const exp = { hours, minutes, seconds, miliseconds };
    expect(res).toStrictEqual(exp);
  }

  ctx(3, 27, 5, 10);
  ctx(10, 50, 0, 0);
})
