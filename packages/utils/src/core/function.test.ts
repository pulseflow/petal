import { invoke, tap } from './function';

it('tap', () => {
	expect(tap(1, value => value++)).toEqual(1);
	expect(tap({ a: 1 }, obj => obj.a++)).toEqual({ a: 2 });
	expect(invoke(() => ({ a: 1 }))).toEqual({ a: 1 });
});
