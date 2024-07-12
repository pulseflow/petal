/**
 * @deprecated `is` patterns are no longer recommended. will be removed once the package is migrated.
 * @module
 */
import { toString } from './string';

export function assertPrimitiveCondition(condition: boolean, message: string): asserts condition {
	if (!condition)
		throw new Error(message);
}

export const isDef = <T = any>(val?: T): val is T => typeof val !== 'undefined';
export const isBoolean = (val: any): val is boolean => typeof val === 'boolean';
export const isFunction = <T extends (...any: any[]) => any> (val: any): val is T => typeof val === 'function';
export const isNumber = (val: any): val is number => typeof val === 'number';
export const isString = (val: unknown): val is string => typeof val === 'string';
export const isObject = (val: any): val is object => toString(val) === '[object Object]';
export const isUndefined = (val: any): val is undefined => toString(val) === '[object Undefined]';
export const isNull = (val: any): val is null => toString(val) === '[object Null]';
export const isRegExp = (val: any): val is RegExp => toString(val) === '[object RegExp]';
export const isDate = (val: any): val is Date => toString(val) === '[object Date]';
