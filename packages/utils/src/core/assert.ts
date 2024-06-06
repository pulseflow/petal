/**
 * @deprecated `is` patterns are no longer recommended. will be removed once the package is migrated.
 */
import { toString } from './index';

export type Primitive = 'string' | 'number' | 'bigint' | 'boolean' | 'null';

function err(is: any, should: string) {
	throw new TypeError(`expected ${is} to be ${should}`);
}

export function assert<T>(i: T) {
	function is(type: Primitive) {
		switch (type) {
			case 'null':
				if (i !== null)
					err(i, 'null');
				break;
			case 'string':
			case 'number':
			case 'bigint':
			case 'boolean':
				// eslint-disable-next-line valid-typeof -- primitive isnt actually a valid typeof
				if (typeof i !== type)
					err(i, type);
				break;
			default:
				err(type, 'a valid primitive');
		}
	}

	function eq(o: T) {
		if (i !== o)
			throw new TypeError(`expected ${i} to be equal to ${o}`);
	}

	function neq(o: T) {
		if (i === o)
			throw new TypeError(`expected ${i} to be different from ${o}`);
	}

	return { is, eq, neq };
}

export const isDef = <T = any>(val?: T): val is T => typeof val !== 'undefined';
export const isBoolean = (val: any): val is boolean => typeof val === 'boolean';
export const isFunction = <T extends Function> (val: any): val is T => typeof val === 'function';
export const isNumber = (val: any): val is number => typeof val === 'number';
export const isString = (val: unknown): val is string => typeof val === 'string';
export const isObject = (val: any): val is object => toString(val) === '[object Object]';
export const isUndefined = (val: any): val is undefined => toString(val) === '[object Undefined]';
export const isNull = (val: any): val is null => toString(val) === '[object Null]';
export const isRegExp = (val: any): val is RegExp => toString(val) === '[object RegExp]';
export const isDate = (val: any): val is Date => toString(val) === '[object Date]';

// @ts-expect-error `window` doesn't exist
export const isWindow = (val: any): boolean => typeof window !== 'undefined' && toString(val) === '[object Window]';
// @ts-expect-error `window` doesn't exist
export const isBrowser = typeof window !== 'undefined';

export type ExpectPrimitive =
	| 'def' | 'boolean' | 'function' | 'number' | 'string' | 'object' | 'undefined' | 'null' | 'regexp' | 'date' | 'window' | 'browser';

export function assertExpect<T>(i: T) {
	const is = (type: ExpectPrimitive): boolean => {
		switch (type) {
			case 'string': return isString(i);
			case 'number': return isNumber(i);
			case 'boolean': return isBoolean(i);
			case 'undefined': return isUndefined(i);
			case 'object': return isObject(i);
			case 'function': return isFunction(i);
			case 'def': return isDef(i);
			case 'null': return isNull(i);
			case 'regexp': return isRegExp(i);
			case 'date': return isDate(i);
			case 'window': return isWindow(i);
			case 'browser': return isBrowser;
		}
	};

	const neq = (o: T) => assert(i).neq(o);
	const eq = (o: T) => assert(i).eq(o);

	return { is, neq, eq };
}
