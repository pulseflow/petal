export type Awaitable<Type> = PromiseLike<Type> | Type;

export type If<Value extends boolean, TrueResult, FalseResult> = Value extends true
	? TrueResult
	: Value extends false
		? FalseResult
		: TrueResult | FalseResult;

export function isFunction<A extends any[], R>(input: (...args: A) => R): true;
export function isFunction(input: any): input is (...args: any[]) => any;
export function isFunction(input: unknown): boolean {
	return typeof input === 'function';
}

export function isPromise<Type>(input: PromiseLike<Type>): true;
export function isPromise(input: any): input is PromiseLike<any>;
export function isPromise(input: unknown): boolean {
	return typeof input === 'object' && input !== null && ('then' in input && typeof input.then === 'function');
}

export function returnThis<U>(this: U): U {
	return this;
}
