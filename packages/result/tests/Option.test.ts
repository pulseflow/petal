import { setTimeout as sleep } from 'node:timers/promises';
import { err, type Err, none, type None, ok, type Ok, Option, OptionError, some, type Some } from '../src/index';
import { error, makeThrow } from './shared';

describe('option', () => {
	describe('prototype', () => {
		describe('isSome', () => {
			it('given some then always returns true', () => {
				const x = some(2);
				expect<boolean>(x.isSome()).toBe(true);
			});

			it('given none then always returns false', () => {
				const x = none;
				expect<boolean>(x.isSome()).toBe(false);
			});
		});

		describe('isSomeAnd', () => {
			it('given some and true-returning callback then returns true', () => {
				const x = some(2);
				const cb = vi.fn((value: number) => value > 1);

				expect(x.isSomeAnd(cb)).toBe(true);
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(2);
				expect(cb).toHaveLastReturnedWith(true);
			});

			it('given some and false-returning callback then returns false', () => {
				const x = some(0);
				const cb = vi.fn((value: number) => value > 1);

				expect(x.isSomeAnd(cb)).toBe(false);
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(0);
				expect(cb).toHaveLastReturnedWith(false);
			});

			it('given none then always returns false', () => {
				const x = none;
				const cb = vi.fn((value: number) => value > 1);

				expect(x.isSomeAnd(cb)).toBe(false);
				expect(cb).not.toHaveBeenCalled();
			});
		});

		describe('isNone', () => {
			it('given some then always returns false', () => {
				const x = some(2);
				expect<boolean>(x.isNone()).toBe(false);
			});

			it('given none then always returns true', () => {
				const x = none;
				expect<boolean>(x.isNone()).toBe(true);
			});
		});

		describe('expect', () => {
			it('given ok then returns value', () => {
				const x = some(2);

				expect<number>(x.expect('Whoops!')).toBe(2);
			});

			it('given none then throws OptionError', () => {
				const x = none;

				expectOptionError('Whoops!', () => x.expect('Whoops!'));
			});
		});

		describe('unwrap', () => {
			it('given some then returns value', () => {
				const x = some(2);

				expect<number>(x.unwrap()).toBe(2);
			});

			it('given none then throws OptionError', () => {
				const x = none;

				expectOptionError('Unwrap failed', () => x.unwrap());
			});
		});

		describe('unwrapOr', () => {
			it('given some then returns value', () => {
				const x = some(2);

				expect<number>(x.unwrapOr(5)).toBe(2);
			});

			it('given none then returns default', () => {
				const x = none;

				expect<5>(x.unwrapOr(5)).toBe(5);
			});

			it('given Option<T> then returns union', () => {
				const x = some(2) as Option<number>;

				expect<number | null>(x.unwrapOr(null)).toBe(2);
			});
		});

		describe('unwrapOrElse', () => {
			it('given some then returns value', () => {
				const x = some(2);

				expect<number>(x.unwrapOrElse(() => 5)).toBe(2);
			});

			it('given none then returns default', () => {
				const x = none;

				expect<5>(x.unwrapOrElse(() => 5)).toBe(5);
			});

			it('given Option<T> then returns union', () => {
				const x = some(2) as Option<number>;

				expect<number | null>(x.unwrapOrElse(() => null)).toBe(2);
			});
		});

		describe('map', () => {
			it('given some then returns mapped value', () => {
				const x = some('Hello, world!');
				const op = vi.fn((value: string) => value.length);

				expect<Some<number>>(x.map(op)).toEqual(some(13));
				expect(op).toHaveBeenCalledTimes(1);
				expect(op).toHaveBeenCalledWith('Hello, world!');
				expect(op).toHaveLastReturnedWith(13);
			});

			it('given none then returns self', () => {
				const x = none;
				const op = vi.fn((value: string) => value.length);

				expect<None>(x.map(op)).toBe(none);
				expect(op).not.toHaveBeenCalled();
			});
		});

		describe('mapInto', () => {
			it('given some then returns mapped option', () => {
				const x = some('Hello, world!');
				const op = vi.fn((value: string) => some(value.length));

				expect<Some<number>>(x.mapInto(op)).toEqual(some(13));
				expect(op).toHaveBeenCalledTimes(1);
				expect(op).toHaveBeenCalledWith('Hello, world!');
				expect(op).toHaveLastReturnedWith(some(13));
			});

			it('given none then returns itself', () => {
				const x = none;
				const op = vi.fn((value: string) => some(value.length));

				expect<None>(x.mapInto(op)).toBe(none);
				expect(op).not.toHaveBeenCalled();
			});
		});

		describe('mapOr', () => {
			it('given some then returns mapped value', () => {
				const x = some('Hello, world!');
				const op = vi.fn((value: string) => value.length);

				expect<number>(x.mapOr(5, op)).toEqual(13);
				expect(op).toHaveBeenCalledTimes(1);
				expect(op).toHaveBeenCalledWith('Hello, world!');
				expect(op).toHaveLastReturnedWith(13);
			});

			it('given none then returns default value', () => {
				const x = none;
				const op = vi.fn((value: string) => value.length);

				expect<number>(x.mapOr(5, op)).toBe(5);
				expect(op).not.toHaveBeenCalled();
			});
		});

		describe('mapOrElse', () => {
			it('given some then returns mapped value', () => {
				const x = some('Hello, world!');
				const op = vi.fn((value: string) => value.length);
				const df = vi.fn(() => 5);

				expect<number>(x.mapOrElse(df, op)).toEqual(13);
				expect(op).toHaveBeenCalledTimes(1);
				expect(op).toHaveBeenCalledWith('Hello, world!');
				expect(op).toHaveLastReturnedWith(13);
				expect(df).not.toHaveBeenCalled();
			});

			it('given none then returns default value', () => {
				const x = none;
				const op = vi.fn((value: string) => value.length);
				const df = vi.fn(() => 5);

				expect<number>(x.mapOrElse(df, op)).toBe(5);
				expect(df).toHaveBeenCalledTimes(1);
				expect(df).toHaveBeenCalledWith();
				expect(df).toHaveLastReturnedWith(5);
				expect(op).not.toHaveBeenCalled();
			});
		});

		describe('mapNoneInto', () => {
			it('given some then returns itself', () => {
				const x = some('Hello, world!');
				const op = vi.fn(() => some(13));

				expect<Some<string>>(x.mapNoneInto(op)).toBe(x);
				expect(op).not.toHaveBeenCalled();
			});

			it('given none then returns mapped option', () => {
				const x = none;
				const op = vi.fn(() => some(13));

				expect<Some<number>>(x.mapNoneInto(op)).toEqual(some(13));
				expect(op).toHaveBeenCalledTimes(1);
				expect(op).toHaveLastReturnedWith(some(13));
			});
		});

		describe('inspect', () => {
			it('given some then calls callback and returns self', () => {
				const x = some(2);
				const cb = vi.fn();

				expect<typeof x>(x.inspect(cb)).toBe(x);
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(2);
			});

			it('given none then returns self', () => {
				const x = none;
				const cb = vi.fn();

				expect<typeof x>(x.inspect(cb)).toBe(x);
				expect(cb).not.toHaveBeenCalled();
			});
		});

		describe('inspectAsync', () => {
			it('given some then calls callback and returns self', async () => {
				const x = some(2);
				let finished = false;
				const cb = vi.fn(async () => sleep(5).then(() => (finished = true)));

				await expect<Promise<typeof x>>(x.inspectAsync(cb)).resolves.toBe(x);
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(2);
				expect(finished).toBe(true);
			});

			it('given none then returns self', async () => {
				const x = none;
				const cb = vi.fn();

				await expect<Promise<typeof x>>(x.inspectAsync(cb)).resolves.toBe(x);
				expect(cb).not.toHaveBeenCalled();
			});
		});

		describe('okOr', () => {
			it('given some(s) then returns ok(s)', () => {
				const x = some('hello');

				expect<Ok<string>>(x.okOr(0)).toEqual(ok('hello'));
			});

			it('given none then returns err(default)', () => {
				const x = none;

				expect<Err<number>>(x.okOr(0)).toEqual(err(0));
			});
		});

		describe('okOrElse', () => {
			it('given some(s) then returns ok(s)', () => {
				const x = some('hello');
				const op = vi.fn(() => 0);

				expect<Ok<string>>(x.okOrElse(op)).toEqual(ok('hello'));
				expect(op).not.toHaveBeenCalled();
			});

			it('given none then returns err(default)', () => {
				const x = none;
				const op = vi.fn(() => 0);

				expect<Err<number>>(x.okOrElse(op)).toEqual(err(0));
				expect(op).toHaveBeenCalledTimes(1);
				expect(op).toHaveBeenCalledWith();
				expect(op).toHaveLastReturnedWith(0);
			});
		});

		describe('iter', () => {
			it('given ok then yields one value', () => {
				const x = some(2);

				expect<number[]>([...x.iter()]).toStrictEqual([2]);
			});

			it('given err then yields no values', () => {
				const x = none;

				expect<number[]>([...x.iter()]).toStrictEqual([]);
			});
		});

		describe('and', () => {
			it('given x=some and y=some then returns y', () => {
				const x = some(2);
				const y = some('Hello');

				expect<typeof y>(x.and(y)).toBe(y);
			});

			it('given x=some and y=none then returns y', () => {
				const x = some(2);
				const y = none;

				expect<typeof y>(x.and(y)).toBe(y);
			});

			it('given x=none and y=some then returns x', () => {
				const x = none;
				const y = some('Hello');

				expect<typeof x>(x.and(y)).toBe(x);
			});

			it('given x=none and y=none then returns x', () => {
				const x = none;
				const y = none;

				expect<typeof x>(x.and(y)).toBe(x);
			});
		});

		describe('andThen', () => {
			const cb = (value: number) => (value === 0 ? none : some(4 / value));

			it('given some and some-returning callback then returns some', () => {
				const x = some(4);
				const op = vi.fn(cb);

				expect<Option<number>>(x.andThen(op)).toEqual(some(1));
				expect(op).toHaveBeenCalledTimes(1);
				expect(op).toHaveBeenCalledWith(4);
				expect(op).toHaveLastReturnedWith(some(1));
			});

			it('given some and none-returning callback then returns none', () => {
				const x = some(0);
				const op = vi.fn(cb);

				expect<Option<number>>(x.andThen(op)).toEqual(none);
				expect(op).toHaveBeenCalledTimes(1);
				expect(op).toHaveBeenCalledWith(0);
				expect(op).toHaveLastReturnedWith(none);
			});

			it('given none then always returns none', () => {
				const x = none;
				const op = vi.fn(cb);

				expect<typeof x>(x.andThen(op)).toBe(none);
				expect(op).not.toHaveBeenCalled();
			});
		});

		describe('or', () => {
			it('given x=some and y=some then returns x', () => {
				const x = some(2);
				const y = some(100);

				expect<typeof x>(x.or(y)).toBe(x);
			});

			it('given x=some and y=none then returns x', () => {
				const x = some(2);
				const y = none;

				expect<typeof x>(x.or(y)).toBe(x);
			});

			it('given x=none and y=some then returns y', () => {
				const x = none;
				const y = some(2);

				expect<typeof y>(x.or(y)).toBe(y);
			});

			it('given x=none and y=none then returns y', () => {
				const x = none;
				const y = none;

				expect<typeof y>(x.or(y)).toBe(y);
			});
		});

		describe('orElse', () => {
			const nobody = () => none;
			const vikings = () => some('vikings');

			it('given some and some-returning callback then returns self', () => {
				const x = some('barbarians');
				const op = vi.fn(vikings);

				expect<typeof x>(x.orElse(op)).toBe(x);
				expect(op).not.toHaveBeenCalled();
			});

			it('given none and some-returning callback then returns some', () => {
				const x = none;
				const op = vi.fn(vikings);

				expect<Some<string>>(x.orElse(op)).toEqual(some('vikings'));
				expect(op).toHaveBeenCalledTimes(1);
				expect(op).toHaveBeenCalledWith();
				expect(op).toHaveLastReturnedWith(some('vikings'));
			});

			it('given none and none-returning callback then returns none', () => {
				const x = none;
				const op = vi.fn(nobody);

				expect<None>(x.orElse(op)).toEqual(none);
				expect(op).toHaveBeenCalledTimes(1);
				expect(op).toHaveBeenCalledWith();
				expect(op).toHaveLastReturnedWith(none);
			});
		});

		describe('xor', () => {
			it('given x=some(s), y=some(t) / s !== t then returns none', () => {
				const x = some(2);
				const y = some(3);

				expect<None>(x.xor(y)).toEqual(none);
			});

			it('given x=some(s), y=none then returns some(s)', () => {
				const x = some(2);
				const y = none;

				expect<typeof x>(x.xor(y)).toBe(x);
			});

			it('given x=none, y=some(t) then returns some(t)', () => {
				const x = none;
				const y = some(3);

				expect<typeof y>(x.xor(y)).toBe(y);
			});

			it('given x=none, y=none then returns none', () => {
				const x = none;
				const y = none;

				expect<None>(x.xor(y)).toEqual(none);
			});
		});

		describe('filter', () => {
			const cb = (value: number) => value % 2 === 0;

			it('given some(s) and some-returning callback then returns some(s)', () => {
				const x = some(4);
				const op = vi.fn(cb);

				expect(x.filter(op)).toBe(x);
				expect(op).toHaveBeenCalledTimes(1);
				expect(op).toHaveBeenCalledWith(4);
				expect(op).toHaveLastReturnedWith(true);
			});

			it('given some(s) and none-returning callback then returns none', () => {
				const x = some(3);
				const op = vi.fn(cb);

				expect(x.filter(op)).toEqual(none);
				expect(op).toHaveBeenCalledTimes(1);
				expect(op).toHaveBeenCalledWith(3);
				expect(op).toHaveLastReturnedWith(false);
			});

			it('given none then always returns none', () => {
				const x = none;
				const op = vi.fn(cb);

				expect(x.filter(op)).toEqual(none);
				expect(op).not.toHaveBeenCalled();
			});
		});

		describe('contains', () => {
			it('given some(s), s then returns true', () => {
				const x = some(2);

				expect<boolean>(x.contains(2)).toBe(true);
			});

			it('given some(s), t / s !== t then returns false', () => {
				const x = some(2);

				expect<boolean>(x.contains(3)).toBe(false);
			});

			it('given none then always returns false', () => {
				const x = none;

				expect<boolean>(x.contains(2)).toBe(false);
			});
		});

		describe('zip', () => {
			it('given x=some(s), y=some(t) then always returns some([s, t])', () => {
				const x = some(1);
				const y = some('hi');

				expect<Some<[number, string]>>(x.zip(y)).toEqual(some([1, 'hi']));
			});

			it('given x=some(s), y=none then always returns none', () => {
				const x = some(1);
				const y = none;

				expect<None>(x.zip(y)).toEqual(none);
			});

			it('given x=none, y=some(t) then always returns none', () => {
				const x = none;
				const y = some('hi');

				expect<None>(x.zip(y)).toEqual(none);
			});

			it('given x=none, y=none then always returns none', () => {
				const x = none;
				const y = none;

				expect<None>(x.zip(y)).toEqual(none);
			});
		});

		describe('zipWith', () => {
			const cb = (s: number, o: number) => s * o;

			it('given x=some, y=some then always returns some', () => {
				const x = some(2);
				const y = some(4);
				const op = vi.fn(cb);

				expect<Some<number>>(x.zipWith(y, op)).toEqual(some(8));
				expect(op).toHaveBeenCalledTimes(1);
				expect(op).toHaveBeenCalledWith(2, 4);
				expect(op).toHaveLastReturnedWith(8);
			});

			it('given x=some, y=none then always returns none', () => {
				const x = some(2);
				const y = none;
				const op = vi.fn(cb);

				expect<None>(x.zipWith(y, op)).toEqual(none);
				expect(op).not.toHaveBeenCalled();
			});

			it('given x=none, y=some then always returns none', () => {
				const x = none;
				const y = some(4);
				const op = vi.fn(cb);

				expect<None>(x.zipWith(y, op)).toEqual(none);
				expect(op).not.toHaveBeenCalled();
			});

			it('given x=none, y=none then always returns none', () => {
				const x = none;
				const y = none;
				const op = vi.fn(cb);

				expect<None>(x.zipWith(y, op)).toEqual(none);
				expect(op).not.toHaveBeenCalled();
			});
		});

		describe('unzip', () => {
			it('given some([s, t]) then always returns [some(s), some(t)]', () => {
				const x = some([1, 'hi'] as const);

				expect<[Some<1>, Some<'hi'>]>(x.unzip()).toEqual([some(1), some('hi')]);
			});

			it('given none then always returns [none, none]', () => {
				const x = none;

				expect<[None, None]>(x.unzip()).toEqual([none, none]);
			});
		});

		describe('transpose', () => {
			it('given some(ok(s)) then returns ok(some(s))', () => {
				const x = some(ok(5));

				expect(x.transpose()).toEqual(ok(some(5)));
			});

			it('given some(err(e)) then returns err(e)', () => {
				const x = some(err('Some error message'));

				expect(x.transpose()).toEqual(err('Some error message'));
			});

			it('given none then returns ok(none)', () => {
				const x = none;

				expect<Ok<None>>(x.transpose()).toEqual(ok(none));
			});
		});

		describe('flatten', () => {
			it('given some(some(s)) then returns some(s)', () => {
				const x = some(some(3));

				expect<Some<number>>(x.flatten()).toEqual(some(3));
			});

			it('given some(none) then returns none', () => {
				const x = some(none);

				expect<None>(x.flatten()).toEqual(none);
			});

			it('given none then returns self', () => {
				const x = none;

				expect<typeof x>(x.flatten()).toBe(x);
			});
		});

		describe('intoPromise', () => {
			it('given some(Promise(s)) then returns Promise(some(s))', async () => {
				const x = some(Promise.resolve(3));

				await expect<Promise<Some<number>>>(x.intoPromise()).resolves.toEqual(some(3));
			});

			it('given none then returns Promise(none)', async () => {
				const x = none;

				await expect<Promise<None>>(x.intoPromise()).resolves.toEqual(none);
			});
		});

		describe('eq', () => {
			it('given x=some(s), y=some(s) then returns true', () => {
				const x = some(3);
				const y = some(3);

				expect<boolean>(x.eq(y)).toBe(true);
			});

			it('given x=some(s), y=some(t) / s !== t then returns false', () => {
				const x = some(3);
				const y = some(4);

				expect<boolean>(x.eq(y)).toBe(false);
			});

			it('given x=some(s), y=none then always returns false', () => {
				const x = some(3);
				const y = none;

				expect<boolean>(x.eq(y)).toBe(false);
			});

			it('given x=none, y=some(t) then always returns false', () => {
				const x = none;
				const y = some(4);

				expect<boolean>(x.eq(y)).toBe(false);
			});

			it('given x=none, y=none then returns true', () => {
				const x = none;
				const y = none;

				expect<boolean>(x.eq(y)).toBe(true);
			});
		});

		describe('ne', () => {
			it('given x=some(s), y=some(s) then returns false', () => {
				const x = some(3);
				const y = some(3);

				expect<boolean>(x.ne(y)).toBe(false);
			});

			it('given x=some(s), y=some(t) / s !== t then returns true', () => {
				const x = some(3);
				const y = some(4);

				expect<boolean>(x.ne(y)).toBe(true);
			});

			it('given x=some(s), y=none then always returns true', () => {
				const x = some(3);
				const y = none;

				expect<boolean>(x.ne(y)).toBe(true);
			});

			it('given x=none, y=some(t) then always returns true', () => {
				const x = none;
				const y = some(4);

				expect<boolean>(x.ne(y)).toBe(true);
			});

			it('given x=none, y=none then always returns false', () => {
				const x = none;
				const y = none;

				expect<boolean>(x.ne(y)).toBe(false);
			});
		});

		describe('match', () => {
			it('given some then calls some callback', () => {
				const x = Option.some(2);
				const some = vi.fn((value: number) => value * 2);
				const none = vi.fn(() => 0);

				expect<number>(x.match({ none, some })).toBe(4);
				expect(some).toHaveBeenCalledTimes(1);
				expect(some).toHaveBeenCalledWith(2);
				expect(some).toHaveLastReturnedWith(4);
				expect(none).not.toHaveBeenCalled();
			});

			it('given none then calls none callback', () => {
				const x = Option.none;
				const some = vi.fn((value: number) => value * 2);
				const none = vi.fn(() => 0);

				expect<number>(x.match({ none, some })).toBe(0);
				expect(some).not.toHaveBeenCalled();
				expect(none).toHaveBeenCalledTimes(1);
				expect(none).toHaveBeenCalledWith();
				expect(none).toHaveLastReturnedWith(0);
			});
		});
	});

	describe('some', () => {
		it('given some then returns Some', () => {
			const x = some(42);

			expect(x.isSome()).toBe(true);
			expect(x.isNone()).toBe(false);
		});
	});

	describe('none', () => {
		it('given none then returns None', () => {
			const x = none;

			expect(x.isSome()).toBe(false);
			expect(x.isNone()).toBe(true);
		});
	});

	describe('from', () => {
		it.each([
			['T', 42],
			['Some(T)', some(42)],
			['() => T', () => 42],
			['() => Some(T)', () => some(42)],
		])('given from(%s) then returns Some(T)', (_, cb) => expect(Option.from(cb)).toStrictEqual(some(42)));

		it.each([
			['null', null],
			['None', none],
			['() => null', () => null],
			['() => None', () => none],
			['() => throw', makeThrow],
		])('given from(%s) then returns None', (_, resolvable) => expect(Option.from(resolvable)).toStrictEqual(none));
	});

	describe('fromAsync', () => {
		it.each([
			['T', 42],
			['Promise.resolve(T)', Promise.resolve(42)],
			['Some(T)', some(42)],
			['Promise.resolve(Some(T))', Promise.resolve(some(42))],
			['() => T', () => 42],
			['() => Some(T)', () => some(42)],
			['() => Promise.resolve(T)', async () => Promise.resolve(42)],
			['() => Promise.resolve(Some(T))', async () => Promise.resolve(some(42))],
		])('given fromAsync(%s) then returns Some(T)', async (_, cb) => expect(await Option.fromAsync(cb)).toStrictEqual(some(42)));

		it.each([
			['null', null],
			['None', none],
			['() => null', () => null],
			['() => Promise.resolve(null)', async () => Promise.resolve(null)],
			['() => None', () => none],
			['() => Promise.resolve(None)', async () => Promise.resolve(none)],
			['() => throw', makeThrow],
			['() => Promise.reject(error)', async () => Promise.reject(error)],
		])('given fromAsync(%s) then returns None', async (_, resolvable) => expect(await Option.fromAsync(resolvable)).toStrictEqual(none));
	});

	describe('all', () => {
		it('given empty array then returns Option<[]>', () => {
			expect<Option<[]>>(Option.all([])).toEqual(some([]));
		});

		type Expected = Option<[number, boolean, bigint]>;

		it('given array of Some then returns Some', () => {
			const a: Option<number> = some(5);
			const b: Option<boolean> = some(true);
			const c: Option<bigint> = some(1n);

			expect<Expected>(Option.all([a, b, c])).toEqual(some([5, true, 1n]));
		});

		it('given array of Some with one None then returns None', () => {
			const a: Option<number> = some(5);
			const b: Option<boolean> = some(true);
			const c: Option<bigint> = none;

			expect<Expected>(Option.all([a, b, c])).toBe(none);
		});
	});

	describe('any', () => {
		it('given empty array then returns Option<never>', () => {
			expect<Option<never>>(Option.any([])).toBe(none);
		});

		type Expected = Option<number | boolean | bigint>;

		it('given array with at least one Some then returns first Some', () => {
			const a: Option<number> = some(5);
			const b: Option<boolean> = some(true);
			const c: Option<bigint> = none;

			expect<Expected>(Option.any([a, b, c])).toBe(a);
		});

		it('given array of None then returns None', () => {
			const a: Option<number> = none;
			const b: Option<boolean> = none;
			const c: Option<bigint> = none;

			expect<Expected>(Option.any([a, b, c])).toBe(none);
		});
	});

	describe('@@toStringTag', () => {
		it('given Some then returns "Some"', () => {
			expect<string>(some(1)[Symbol.toStringTag]).toBe('Some');
		});

		it('given None then returns "None"', () => {
			expect<string>(none[Symbol.toStringTag]).toBe('None');
		});
	});

	describe('types', () => {
		it('given Some<T> then assigns to Option<T>', () => {
			expect<Option<string>>(some('foo'));
		});

		it('given None then assigns to Option<T>', () => {
			expect<Option<string>>(none);
		});
	});
});

function expectOptionError(message: string, cb: () => any) {
	try {
		cb();

		throw new Error('cb should have thrown');
	}
	catch (raw) {
		const error = raw as OptionError;

		expect(error).toBeInstanceOf(OptionError);
		expect<string>(error.name).toBe('OptionError');
		expect<string>(error.message).toBe(message);
	}
}
