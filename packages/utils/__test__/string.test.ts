import {expect, test} from 'vitest';
import {hello} from '../src/string';

test('hello world', () => {
  expect(hello()).toBe('hello world');
});
