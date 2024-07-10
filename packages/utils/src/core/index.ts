export * from './array';
export * from './assert';
// export * from './crypto';
export * from './equal';
export * from './event';
export * from './function';
export * from './guards';
export * from './io';
export * from './json';
export * from './math';
export * from './object';
export * from './promise';
export * from './string';
export * from './time';

export function assert(condition: boolean, message: string): asserts condition {
	if (!condition)
		throw new Error(message);
}

export const toString = (v: any) => Object.prototype.toString.call(v);
