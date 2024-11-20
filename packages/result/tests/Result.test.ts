import { setTimeout as sleep } from 'node:timers/promises';
import { err, type Err, none, type None, ok, type Ok, Option, Result, ResultError, some, type Some } from '../src/index';
import { error, makeThrow } from './shared';

describe('result', () => {
	describe('prototype', () => {
		describe('isOk', () => {
			it('given ok then always returns true', () => {
				const x = ok(42);
				expect<boolean>(x.isOk()).toBe(true);
			});

			it('given err then always returns false', () => {
				const x = err('Some error message');
				expect<boolean>(x.isOk()).toBe(false);
			});
		});

		describe('isOkAnd', () => {
			it('given ok and true-returning callback then returns true', () => {
				const x = ok(2);
				const cb = vi.fn((value: number) => value > 1);

				expect(x.isOkAnd(cb)).toBe(true);
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(2);
				expect(cb).toHaveLastReturnedWith(true);
			});

			it('given ok and false-returning callback then returns false', () => {
				const x = ok(0);
				const cb = vi.fn((value: number) => value > 1);

				expect(x.isOkAnd(cb)).toBe(false);
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(0);
				expect(cb).toHaveLastReturnedWith(false);
			});

			it('given err then always returns false', () => {
				const x = err('Some error message');
				const cb = vi.fn((value: number) => value > 1);

				expect<boolean>(x.isOkAnd(cb)).toBe(false);
				expect(cb).not.toHaveBeenCalled();
			});
		});

		describe('isErr', () => {
			it('given ok then returns false', () => {
				const x = ok(42);
				expect<boolean>(x.isErr()).toBe(false);
			});

			it('given err then returns true', () => {
				const x = err('Some error message');
				expect<boolean>(x.isErr()).toBe(true);
			});
		});

		describe('isErrAnd', () => {
			it('given ok and true-returning callback then returns true', () => {
				const x = ok(2);
				const cb = vi.fn((value: Error) => value instanceof TypeError);

				expect(x.isErrAnd(cb)).toBe(false);
				expect(cb).not.toHaveBeenCalled();
			});

			it('given err and false-returning callback then returns false', () => {
				const error = new Error('Some error message');
				const x = err(error);
				const cb = vi.fn((value: Error) => value instanceof TypeError);

				expect(x.isErrAnd(cb)).toBe(false);
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(error);
				expect(cb).toHaveLastReturnedWith(false);
			});

			it('given err and true-returning callback then returns false', () => {
				const error = new TypeError('Some error message');
				const x = err(error);
				const cb = vi.fn((value: Error) => value instanceof TypeError);

				expect(x.isErrAnd(cb)).toBe(true);
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(error);
				expect(cb).toHaveLastReturnedWith(true);
			});
		});

		describe('ok', () => {
			it('given ok then returns some', () => {
				const x = ok(2);

				expect<Some<number>>(x.ok()).toEqual(some(2));
			});

			it('given err then returns none', () => {
				const x = err('Some error message');

				expect<None>(x.ok()).toEqual(none);
			});
		});

		describe('err', () => {
			it('given ok then returns none', () => {
				const x = ok(2);

				expect<None>(x.err()).toEqual(none);
			});

			it('given err then returns some', () => {
				const x = err('Some error message');

				expect<Some<string>>(x.err()).toEqual(Option.some('Some error message'));
			});
		});

		describe('map', () => {
			it('given ok then returns ok with mapped value', () => {
				const x = ok(2);
				const cb = vi.fn((value: number) => value > 1);

				expect<Ok<boolean>>(x.map(cb)).toEqual(ok(true));
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(2);
				expect(cb).toHaveLastReturnedWith(true);
			});

			it('given err then returns err', () => {
				const x = err('Some error message');
				const cb = vi.fn((value: number) => value > 1);

				expect(x.map(cb)).toEqual(err('Some error message'));
				expect(cb).not.toHaveBeenCalled();
			});
		});

		describe('mapInto', () => {
			it('given ok then returns mapped result', () => {
				const x = ok(2);
				const cb = vi.fn((value: number) => ok(value > 1));

				expect<Ok<boolean>>(x.mapInto(cb)).toEqual(ok(true));
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(2);
				expect(cb).toHaveLastReturnedWith(ok(true));
			});

			it('given err then returns itself', () => {
				const x = err('Some error message');
				const cb = vi.fn((value: number) => ok(value > 1));

				expect(x.mapInto(cb)).toBe(x);
				expect(cb).not.toHaveBeenCalled();
			});
		});

		describe('mapOr', () => {
			it('given ok then returns ok with mapped value', () => {
				const x = ok(2);
				const cb = vi.fn((value: number) => value > 1);

				expect<boolean>(x.mapOr(false, cb)).toEqual(true);
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(2);
				expect(cb).toHaveLastReturnedWith(true);
			});

			it('given err then returns err', () => {
				const x = err('Some error message');
				const cb = vi.fn((value: number) => value > 1);

				expect<boolean>(x.mapOr(false, cb)).toEqual(false);
				expect(cb).not.toHaveBeenCalled();
			});
		});

		describe('mapOrElse', () => {
			it('given ok then returns ok with mapped value', () => {
				const x = ok(2);
				const op = vi.fn(() => false);
				const cb = vi.fn((value: number) => value > 1);

				expect<boolean>(x.mapOrElse(op, cb)).toEqual(true);
				expect(op).not.toHaveBeenCalled();
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(2);
				expect(cb).toHaveLastReturnedWith(true);
			});

			it('given err then returns err', () => {
				const x = err('Some error message');
				const op = vi.fn(() => false);
				const cb = vi.fn((value: number) => value > 1);

				expect<boolean>(x.mapOrElse(op, cb)).toEqual(false);
				expect(op).toHaveBeenCalledTimes(1);
				expect(op).toHaveBeenCalledWith('Some error message');
				expect(op).toHaveLastReturnedWith(false);
				expect(cb).not.toHaveBeenCalled();
			});
		});

		describe('mapErr', () => {
			it('given ok then returns ok', () => {
				const x = ok(2);
				const cb = vi.fn((error: string) => error.length);

				expect<Result<number, number>>(x.mapErr(cb)).toEqual(ok(2));
				expect(cb).not.toHaveBeenCalled();
			});

			it('given ok then returns err with mapped value', () => {
				const x = err('Some error message');
				const cb = vi.fn((error: string) => error.length);

				expect<Result<number, number>>(x.mapErr(cb)).toEqual(err(18));
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith('Some error message');
				expect(cb).toHaveLastReturnedWith(18);
			});
		});

		describe('mapErrInto', () => {
			it('given ok then returns itself', () => {
				const x = ok(2);
				const cb = vi.fn((error: string) => ok(error.length));

				expect<Result<number, number>>(x.mapErrInto(cb)).toBe(x);
				expect(cb).not.toHaveBeenCalled();
			});

			it('given err then returns mapped result', () => {
				const x = err('Some error message');
				const cb = vi.fn((error: string) => ok(error.length));

				expect<Result<number, number>>(x.mapErrInto(cb)).toEqual(ok(18));
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith('Some error message');
				expect(cb).toHaveLastReturnedWith(ok(18));
			});
		});

		describe('inspect', () => {
			it('given ok then calls callback and returns self', () => {
				const x = ok(2);
				const cb = vi.fn();

				expect<typeof x>(x.inspect(cb)).toBe(x);
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(2);
			});

			it('given err then returns self', () => {
				const x = err('Some error message');
				const cb = vi.fn();

				expect<typeof x>(x.inspect(cb)).toBe(x);
				expect(cb).not.toHaveBeenCalled();
			});
		});

		describe('inspectAsync', () => {
			it('given ok then calls callback and returns self', async () => {
				const x = ok(2);
				let finished = false;
				const cb = vi.fn(async () => sleep(5).then(() => (finished = true)));

				await expect<Promise<typeof x>>(x.inspectAsync(cb)).resolves.toBe(x);
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(2);
				expect(finished).toBe(true);
			});

			it('given err then returns self', async () => {
				const x = err('Some error message');
				const cb = vi.fn();

				await expect<Promise<typeof x>>(x.inspectAsync(cb)).resolves.toBe(x);
				expect(cb).not.toHaveBeenCalled();
			});
		});

		describe('inspectErr', () => {
			it('given ok then calls callback and returns self', () => {
				const x = ok(2);
				const cb = vi.fn();

				expect<typeof x>(x.inspectErr(cb)).toBe(x);
				expect(cb).not.toHaveBeenCalled();
			});

			it('given err then returns self', () => {
				const x = err('Some error message');
				const cb = vi.fn();

				expect<typeof x>(x.inspectErr(cb)).toBe(x);
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith('Some error message');
			});
		});

		describe('inspectErrAsync', () => {
			it('given ok then calls callback and returns self', async () => {
				const x = ok(2);
				const cb = vi.fn();

				await expect<Promise<typeof x>>(x.inspectErrAsync(cb)).resolves.toBe(x);
				expect(cb).not.toHaveBeenCalled();
			});

			it('given err then returns self', async () => {
				const x = err('Some error message');
				let finished = false;
				const cb = vi.fn(async () => sleep(5).then(() => (finished = true)));

				await expect<Promise<typeof x>>(x.inspectErrAsync(cb)).resolves.toBe(x);
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith('Some error message');
				expect(finished).toBe(true);
			});
		});

		describe('iter', () => {
			it('given ok then yields one value', () => {
				const x = ok(2);

				expect<number[]>([...x.iter()]).toStrictEqual([2]);
			});

			it('given err then yields no values', () => {
				const x = err('Some error message');

				expect<number[]>([...x.iter()]).toStrictEqual([]);
			});
		});

		describe('expect', () => {
			it('given ok then returns value', () => {
				const x = ok(2);

				expect<number>(x.expect('Whoops!')).toBe(2);
			});

			it('given err then throws ResultError', () => {
				const x = err('Some error message');

				expectResultError('Whoops!', 'Some error message', () => x.expect('Whoops!'));
			});
		});

		describe('expectErr', () => {
			it('given ok then throws ResultError', () => {
				const x = ok(2);

				expectResultError('Whoops!', 2, () => x.expectErr('Whoops!'));
			});

			it('given err then returns error', () => {
				const x = err('Some error message');

				expect<string>(x.expectErr('Whoops!')).toBe('Some error message');
			});
		});

		describe('unwrap', () => {
			it('given ok then returns value', () => {
				const x = ok(2);

				expect<number>(x.unwrap()).toBe(2);
			});

			it('given err then throws ResultError', () => {
				const x = err('Some error message');

				expectResultError('Unwrap failed', 'Some error message', () => x.unwrap());
			});
		});

		describe('unwrapErr', () => {
			it('given ok then throws ResultError', () => {
				const x = ok(2);

				expectResultError('Unwrap failed', 2, () => x.unwrapErr());
			});

			it('given err then returns error', () => {
				const x = err('Some error message');

				expect<string>(x.unwrapErr()).toBe('Some error message');
			});
		});

		describe('unwrapOr', () => {
			it('given ok then returns value', () => {
				const x = ok(2);

				expect<number>(x.unwrapOr(5)).toBe(2);
			});

			it('given err then returns default', () => {
				const x = err('Some error message');

				expect<5>(x.unwrapOr(5)).toBe(5);
			});

			it('given Result<T, E> then returns union', () => {
				const x = ok(2) as Result<number, string>;

				expect<number | null>(x.unwrapOr(null)).toBe(2);
			});
		});

		describe('unwrapOrElse', () => {
			it('given ok then returns value', () => {
				const x = ok(2);

				expect<number>(x.unwrapOrElse(() => 5)).toBe(2);
			});

			it('given err then returns default', () => {
				const x = err('Some error message');

				expect<5>(x.unwrapOrElse(() => 5)).toBe(5);
			});

			it('given Result<T, E> then returns union', () => {
				const x = ok(2) as Result<number, string>;

				expect<number | null>(x.unwrapOrElse(() => null)).toBe(2);
			});
		});

		describe('unwrapRaw', () => {
			it('given ok then returns value', () => {
				const x = ok(2);

				expect<number>(x.unwrapRaw()).toBe(2);
			});

			it('given err then throws Error', () => {
				const error = new Error('Some error message');
				const x = err(error);

				expect(() => x.unwrapRaw()).toThrowError(error);
			});
		});

		describe('and', () => {
			it('given x=ok and y=ok then returns y', () => {
				const x = ok(2);
				const y = ok('Hello');

				expect<typeof y>(x.and(y)).toBe(y);
			});

			it('given x=ok and y=err then returns y', () => {
				const x = ok(2);
				const y = err('Late error');

				expect<typeof y>(x.and(y)).toBe(y);
			});

			it('given x=err and y=ok then returns x', () => {
				const x = err('Early error');
				const y = ok('Hello');

				expect<typeof x>(x.and(y)).toBe(x);
			});

			it('given x=err and y=err then returns x', () => {
				const x = err('Early error');
				const y = err('Late error');

				expect<typeof x>(x.and(y)).toBe(x);
			});
		});

		describe('andThen', () => {
			const cb = (value: number) => (value === 0 ? err('overflowed') : ok(4 / value));

			it('given ok and ok-returning callback then returns ok', () => {
				const x = ok(4);
				const op = vi.fn(cb);

				expect<Result<number, string>>(x.andThen(op)).toEqual(ok(1));
				expect(op).toHaveBeenCalledTimes(1);
				expect(op).toHaveBeenCalledWith(4);
				expect(op).toHaveLastReturnedWith(ok(1));
			});

			it('given ok and err-returning callback then returns err', () => {
				const x = ok(0);
				const op = vi.fn(cb);

				expect<Result<number, string>>(x.andThen(op)).toEqual(err('overflowed'));
				expect(op).toHaveBeenCalledTimes(1);
				expect(op).toHaveBeenCalledWith(0);
				expect(op).toHaveLastReturnedWith(err('overflowed'));
			});

			it('given err then always returns err', () => {
				const x = err('not a number');
				const op = vi.fn(cb);

				expect<typeof x>(x.andThen(op)).toBe(x);
				expect(op).not.toHaveBeenCalled();
			});
		});

		describe('or', () => {
			it('given x=ok and y=ok then returns x', () => {
				const x = ok(2);
				const y = ok(100);

				expect<typeof x>(x.or(y)).toBe(x);
			});

			it('given x=ok and y=err then returns x', () => {
				const x = ok(2);
				const y = err('Late error');

				expect<typeof x>(x.or(y)).toBe(x);
			});

			it('given x=err and y=ok then returns y', () => {
				const x = err('Early error');
				const y = ok(2);

				expect<typeof y>(x.or(y)).toBe(y);
			});

			it('given x=err and y=err then returns y', () => {
				const x = err('Early error');
				const y = err('Late error');

				expect<typeof y>(x.or(y)).toBe(y);
			});
		});

		describe('orElse', () => {
			const square = (value: number) => ok(value * value);
			const wrapErr = (error: number) => err(error);

			it('given x=ok, a->ok, b->ok then returns x without calling a or b', () => {
				const x = ok(2);
				const a = vi.fn(square);
				const b = vi.fn(square);

				expect<typeof x>(x.orElse(a).orElse(b)).toBe(x);
				expect(a).not.toHaveBeenCalled();
				expect(b).not.toHaveBeenCalled();
			});

			it('given x=ok, a->ok, b->err then returns x without calling a or b', () => {
				const x = ok(2);
				const a = vi.fn(square);
				const b = vi.fn(wrapErr);

				expect<typeof x>(x.orElse(a).orElse(b)).toBe(x);
				expect(a).not.toHaveBeenCalled();
				expect(b).not.toHaveBeenCalled();
			});

			it('given x=err, a->ok, b->err then returns ok without calling b', () => {
				const x = err(3);
				const a = vi.fn(square);
				const b = vi.fn(wrapErr);

				expect<Ok<number>>(x.orElse(a).orElse(b)).toEqual(ok(9));
				expect(a).toHaveBeenCalledTimes(1);
				expect(a).toHaveBeenCalledWith(3);
				expect(a).toHaveLastReturnedWith(ok(9));
				expect(b).not.toHaveBeenCalled();
			});

			it('given x=err, a->err, b->err then returns ok calling a and b', () => {
				const x = err(3);
				const a = vi.fn(wrapErr);
				const b = vi.fn(wrapErr);

				expect<Err<number>>(x.orElse(a).orElse(b)).toEqual(err(3));
				expect(a).toHaveBeenCalledTimes(1);
				expect(a).toHaveBeenCalledWith(3);
				expect(a).toHaveLastReturnedWith(err(3));
				expect(b).toHaveBeenCalledTimes(1);
				expect(b).toHaveBeenCalledWith(3);
				expect(b).toHaveLastReturnedWith(err(3));
			});
		});

		describe('contains', () => {
			it('given ok and matching value then returns true', () => {
				const x = ok(2);

				expect<boolean>(x.contains(2)).toBe(true);
			});

			it('given ok and different value then returns false', () => {
				const x = ok(3);

				expect<boolean>(x.contains(2)).toBe(false);
			});

			it('given err then always returns false', () => {
				const x = err('Some error message');

				expect<false>(x.contains(2)).toBe(false);
			});
		});

		describe('containsErr', () => {
			it('given ok then always returns false', () => {
				const x = ok(2);

				expect<false>(x.containsErr('Some error message')).toBe(false);
			});

			it('given err and matching value then returns true', () => {
				const x = err('Some error message');

				expect<boolean>(x.containsErr('Some error message')).toBe(true);
			});

			it('given err and different value then returns false', () => {
				const x = err('Some other error message');

				expect<boolean>(x.containsErr('Some error message')).toBe(false);
			});
		});

		describe('transpose', () => {
			it('given Ok<Some<T>> then returns Some<Ok<T>>', () => {
				const x = ok(some(5));

				expect(x.transpose()).toEqual(some(ok(5)));
			});

			it('given Ok<None> then returns None', () => {
				const x = ok(none);

				expect(x.transpose()).toEqual(none);
			});

			it('given Err<E> then returns Some<Err<E>>', () => {
				const x = err('Some error message');

				expect(x.transpose()).toEqual(some(err('Some error message')));
			});
		});

		describe('flatten', () => {
			it('given Ok<Ok<T>> then returns Ok<T>', () => {
				const x = ok(ok('Hello'));

				expect<Ok<string>>(x.flatten()).toEqual(ok('Hello'));
			});

			it('given Ok<Err<E>> then returns Err<E>', () => {
				const x = ok(err(6));

				expect<Err<number>>(x.flatten()).toEqual(err(6));
			});

			it('given Err<E> then returns Err<E>', () => {
				const x = err(6);

				expect<typeof x>(x.flatten()).toBe(x);
			});
		});

		describe('intoOkOrErr', () => {
			it('given ok(s) then returns s', () => {
				const x = ok(3);

				expect<number>(x.intoOkOrErr()).toBe(3);
			});

			it('given err(e) then returns e', () => {
				const x = err(4);

				expect<number>(x.intoOkOrErr()).toBe(4);
			});
		});

		describe('intoPromise', () => {
			it('given ok(Promise(s)) then returns Promise(ok(s))', async () => {
				const x = ok(Promise.resolve(3));

				await expect<Promise<Ok<number>>>(x.intoPromise()).resolves.toEqual(ok(3));
			});

			it('given err(Promise(e)) then returns Promise(err(e))', async () => {
				const x = err(Promise.resolve(3));

				await expect<Promise<Err<number>>>(x.intoPromise()).resolves.toEqual(err(3));
			});
		});

		describe('eq', () => {
			it('given x=ok(s), y=ok(s) then returns true', () => {
				const x = ok(3);
				const y = ok(3);

				expect<boolean>(x.eq(y)).toBe(true);
			});

			it('given x=ok(s), y=ok(t) / s !== t then returns false', () => {
				const x = ok(3);
				const y = ok(4);

				expect<boolean>(x.eq(y)).toBe(false);
			});

			it('given x=ok(s), y=err(e) then always returns false', () => {
				const x = ok(3);
				const y = err(3);

				expect<boolean>(x.eq(y)).toBe(false);
			});

			it('given x=err(e), y=ok(t) then always returns false', () => {
				const x = err(3);
				const y = ok(3);

				expect<boolean>(x.eq(y)).toBe(false);
			});

			it('given x=err(e), y=err(e) then returns true', () => {
				const x = err(3);
				const y = err(3);

				expect<boolean>(x.eq(y)).toBe(true);
			});

			it('given x=err(e), y=err(t) / e !== t then returns false', () => {
				const x = ok(3);
				const y = ok(4);

				expect<boolean>(x.eq(y)).toBe(false);
			});
		});

		describe('ne', () => {
			it('given x=ok(s), y=ok(s) then returns false', () => {
				const x = ok(3);
				const y = ok(3);

				expect<boolean>(x.ne(y)).toBe(false);
			});

			it('given x=ok(s), y=ok(t) / s !== t then returns true', () => {
				const x = ok(3);
				const y = ok(4);

				expect<boolean>(x.ne(y)).toBe(true);
			});

			it('given x=ok(s), y=err(e) then always returns true', () => {
				const x = ok(3);
				const y = err(3);

				expect<boolean>(x.ne(y)).toBe(true);
			});

			it('given x=err(e), y=ok(t) then always returns true', () => {
				const x = err(3);
				const y = ok(3);

				expect<boolean>(x.ne(y)).toBe(true);
			});

			it('given x=err(e), y=err(e) then returns false', () => {
				const x = err(3);
				const y = err(3);

				expect<boolean>(x.ne(y)).toBe(false);
			});

			it('given x=err(e), y=err(t) / e !== t then returns true', () => {
				const x = ok(3);
				const y = ok(4);

				expect<boolean>(x.ne(y)).toBe(true);
			});
		});

		describe('match', () => {
			it('given ok then calls callback', () => {
				const x = Result.ok(2);
				const ok = vi.fn((value: number) => value * 2);
				const err = vi.fn((error: string) => error.length);

				expect<number>(x.match({ err, ok })).toBe(4);
				expect(ok).toHaveBeenCalledTimes(1);
				expect(ok).toHaveBeenCalledWith(2);
				expect(ok).toHaveLastReturnedWith(4);
				expect(err).not.toHaveBeenCalled();
			});

			it('given err then calls callback', () => {
				const x = Result.err('Some error message');
				const ok = vi.fn((value: number) => value * 2);
				const err = vi.fn((error: string) => error.length);

				expect<number>(x.match({ err, ok })).toBe(18);
				expect(ok).not.toHaveBeenCalled();
				expect(err).toHaveBeenCalledTimes(1);
				expect(err).toHaveBeenCalledWith('Some error message');
				expect(err).toHaveLastReturnedWith(18);
			});
		});
	});

	describe('ok', () => {
		it('given ok without an argument then returns Ok<undefined>', () => {
			const x = ok();
			expectTypeOf(x).toMatchTypeOf<Ok<undefined>>();
			expectTypeOf(x).toMatchTypeOf<Result<undefined, Error>>();
			expect<boolean>(x.isOk()).toBe(true);
			expect<boolean>(x.isErr()).toBe(false);
		});

		it('given ok with an argument then returns Ok<T>', () => {
			const x = ok(42);

			expectTypeOf(x).toMatchTypeOf<Ok<number>>();
			expectTypeOf(x).toMatchTypeOf<Result<number, Error>>();
			expect<boolean>(x.isOk()).toBe(true);
			expect<boolean>(x.isErr()).toBe(false);
		});
	});

	describe('err', () => {
		it('given err without an argument then returns Err<undefined>', () => {
			const x = err();
			expectTypeOf(x).toMatchTypeOf<Err<undefined>>();
			expectTypeOf(x).toMatchTypeOf<Result<number, undefined>>();
			expect<boolean>(x.isOk()).toBe(false);
			expect<boolean>(x.isErr()).toBe(true);
		});

		it('given err with an argument then returns Err<T>', () => {
			const x = err(new Error('girls kissing'));

			expectTypeOf(x).toMatchTypeOf<Err<Error>>();
			expectTypeOf(x).toMatchTypeOf<Result<number, Error>>();
			expect<boolean>(x.isOk()).toBe(false);
			expect<boolean>(x.isErr()).toBe(true);
		});
	});

	describe('from', () => {
		it.each([
			['T', 42],
			['Ok(T)', ok(42)],
			['() => T', () => 42],
			['() => Ok(T)', () => ok(42)],
		])('given from(%s) then returns Ok(T)', (_, cb) => {
			const x = Result.from(cb);

			expect(x).toStrictEqual(ok(42));
		});

		it.each([
			['Err(E)', err(error)],
			['() => Err(E)', () => err(error)],
			['() => throw E', makeThrow],
		])('given from(%s) then returns Err(E)', (_, resolvable) => {
			const x = Result.from(resolvable);

			expect(x).toStrictEqual(err(error));
		});
	});

	describe('fromAsync', () => {
		const { fromAsync } = Result;

		it.each([
			['T', 42],
			['Promise.resolve(T)', Promise.resolve(42)],
			['Ok(T)', ok(42)],
			['Promise.resolve(Ok(T))', Promise.resolve(ok(42))],
			['() => T', () => 42],
			['() => Promise.resolve(T)', async () => Promise.resolve(42)],
			['() => Ok(T)', () => ok(42)],
			['() => Promise.resolve(Ok(T))', async () => Promise.resolve(ok(42))],
		])('given fromAsync(%s) then returns Ok(T)', async (_, cb) => {
			const x = await fromAsync(cb);

			expect(x).toStrictEqual(ok(42));
		});

		it.each([
			['Err(E)', err(error)],
			['() => throw E', makeThrow],
			['() => Promise.reject(E)', async () => Promise.reject(error)],
			['() => Err(E)', () => err(error)],
			['() => Promise.reject(Err(E))', async () => Promise.reject(err(error))],
		])('given fromAsync(%s) then returns Err(E)', async (_, resolvable) => {
			let x = await fromAsync(resolvable);

			if (_ === '() => Promise.reject(Err(E))')
				// @ts-expect-error: this test case double nests the error
				x = x.unwrapErr();

			expect(x).toEqual(err(error));
		});
	});

	describe('all', () => {
		it('given empty array then returns Result<[], never>', () => {
			expect<Result<[], never>>(Result.all([])).toEqual(ok([]));
		});

		type Expected = Result<[number, boolean, bigint], string>;

		it('given array of Ok then returns Ok', () => {
			const a: Result<number, string> = ok(5);
			const b: Result<boolean, string> = ok(true);
			const c: Result<bigint, string> = ok(1n);

			expect<Expected>(Result.all([a, b, c])).toEqual(ok([5, true, 1n]));
		});

		it('given array of Ok with one Err then returns Err', () => {
			const a: Result<number, string> = ok(5);
			const b: Result<boolean, string> = ok(true);
			const c: Result<bigint, string> = err('Error!');

			expect<Expected>(Result.all([a, b, c])).toBe(c);
		});
	});

	describe('any', () => {
		it('given empty array then returns Result<[], never>', () => {
			expect<Result<never, []>>(Result.any([])).toEqual(err([]));
		});

		type Expected = Result<number | boolean | bigint, [string, string, string]>;

		it('given array with at least one Ok then returns first Ok', () => {
			const a: Result<number, string> = ok(5);
			const b: Result<boolean, string> = ok(true);
			const c: Result<bigint, string> = err('Error!');

			expect<Expected>(Result.any([a, b, c])).toBe(a);
		});

		it('given array of Ok with one Err then returns Err', () => {
			const a: Result<number, string> = err('Not a number!');
			const b: Result<boolean, string> = err('Not a boolean!');
			const c: Result<bigint, string> = err('Error!');

			expect<Expected>(Result.any([a, b, c])).toEqual(err(['Not a number!', 'Not a boolean!', 'Error!']));
		});
	});

	describe('@@toStringTag', () => {
		it('given Some then returns "Some"', () => {
			expect<string>(ok(1)[Symbol.toStringTag]).toBe('Ok');
		});

		it('given None then returns "None"', () => {
			expect<string>(err(1)[Symbol.toStringTag]).toBe('Err');
		});
	});

	describe('types', () => {
		it('given Ok<T> then assigns to Result<T, E>', () => {
			expect<Result<number, string>>(ok(4));
		});

		it('given Err<E> then assigns to Result<T, E>', () => {
			expect<Result<number, string>>(err('foo'));
		});
	});
});

// eslint-disable-next-line ts/no-unnecessary-type-parameters -- type testing
function expectResultError<E>(message: string, value: E, cb: () => any) {
	try {
		cb();

		throw new Error('cb should have thrown');
	}
	catch (raw) {
		const error = raw as ResultError<E>;

		expect(error).toBeInstanceOf(ResultError);
		expect<string>(error.name).toBe('ResultError');
		expect<string>(error.message).toBe(message);
		expect<E>(error.value).toBe(value);
	}
}
