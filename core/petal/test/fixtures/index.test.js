import { sum } from './';
import { test, expect } from 'vitest';
test('sum', () => {
	expect(sum(1, 1)).toEqual(2);
});
