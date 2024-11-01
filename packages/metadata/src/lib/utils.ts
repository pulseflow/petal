/**
 * The function precondition interface.
 */
export interface FunctionPrecondition {
	/**
	 * The arguments passed to the function or class' method.
	 */
	(...args: any[]): boolean | Promise<boolean>;
}

/**
 * The fallback interface, this is called when the function precondition returns or resolves with a falsy value.
 */
export interface FunctionFallback {
	/**
	 * The arguments passed to the function or class' method.
	 */
	(...args: any[]): unknown;
}

/**
 * Utility to make a method decorator with lighter syntax and inferred types.
 *
 * ```typescript
 * // Enumerable function
 * function enumerableMethod(value: boolean) {
 * 	return createMethodDecorator((_target, _propertyKey, descriptor) => {
 * 		descriptor.enumerable = value;
 * 	});
 * }
 * ```
 * @param fn The method to decorate
 */
export function createMethodDecorator(fn: MethodDecorator): MethodDecorator {
	return fn;
}

/**
 * Utility to make a legacy class decorator with lighter syntax and inferred types.
 *
 * @param fn  - The class to decorate
 *
 * @remarks
 * - This is designed for legacy decorators, not TC39 / ECMAScript decorators. This means that if you do not set
 * `experimentalDecorators` to `true` in your TypeScript configuration, this method will not be useful.
 */
export function createLegacyClassDecorator<TFunction extends (...args: any[]) => void>(fn: TFunction): ClassDecorator {
	return fn;
}

/**
 * Utility to make function preconditions.
 *
 * @example
 * ```typescript
 * // No fallback (returns undefined)
 * function requireGuild(value: number) {
 * 	return createFunctionPrecondition((message: Message) =>
 * 		message.guild !== null
 * 	);
 * }
 *
 * // With fallback
 * function requireGuild(
 * 	value: number,
 * 	fallback: () => unknown = () => undefined
 * ) {
 * 	return createFunctionPrecondition(
 * 		(message: Message) => message.guild !== null,
 * 		fallback
 * 	);
 * }
 * ```
 *
 * @param precondition The function that defines whether or not the function should be run, returning the returned value from fallback
 * @param fallback The fallback value that defines what the method should return in case the precondition fails
 */
export function createFunctionPrecondition(precondition: FunctionPrecondition, fallback: FunctionFallback = (): void => undefined): MethodDecorator {
	return createMethodDecorator((_target, _propertyKey, descriptor) => {
		const method = descriptor.value;
		if (!method)
			throw new Error('Function preconditions require a [[value]].');
		if (typeof method !== 'function')
			throw new Error('Function preconditions can only be applied to functions.');

		descriptor.value = async function descriptorValue(this: (...args: any[]) => any, ...args: any[]) {
			const canRun = await precondition(...args);
			return canRun ? method.call(this, ...args) : fallback.call(this, ...args);
		} as unknown as undefined;
	});
}

/**
 * Creates a new proxy to efficiently add properties to class without creating subclasses
 * @param target The constructor of the class to modify
 * @param handler The handler function to modify the constructor behavior for the target
 * @hidden
 */
export function createProxy<Target extends object>(target: Target, handler: Omit<ProxyHandler<Target>, 'get'>): Target {
	return new Proxy<Target>(target, {
		...handler,
		get: (target, property) => {
			const value = Reflect.get(target, property);
			return typeof value === 'function' ? (...args: readonly unknown[]) => value.apply(target, args) : value;
		},
	});
}
