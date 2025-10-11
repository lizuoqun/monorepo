import { expect, it, test } from 'vitest';
import { add, minus } from '../src/math.ts';

test('adds 1 + 2 to equal 3', () => {
  expect(add(1, 2)).toBe(3);
});

test('subtracts 2 - 1 to equal 1', () => {
  expect(minus(2, 1)).toBe(1);
});

// 多线程并发
it.concurrent('subtracts 100 - 100 to equal 0', () => {
  expect(minus(100, 100)).toBe(0);
  expect(add(100, 100)).toBe(200);
  expect(minus(100, 100)).toBe(0);
  expect(add(100, 100)).toBe(200);
  expect(minus(200, 100)).toBe(100);
});
