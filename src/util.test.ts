import { isWithIn, divide } from "@/util";
import { expect, test } from 'vitest'

test('isWithIn', () => {
  expect(isWithIn(1, { min: 1, max: 3, inclusive: true})).toBe(true);
  expect(isWithIn(1, { min: 1, max: 3, inclusive: false})).toBe(false);
  expect(isWithIn(0, { min: 1, max: 3})).toBe(false);
})

test('duration stuff', () => {
  expect(divide(5, 26)).toStrictEqual({ quotient: 5, remainder: 1});
})