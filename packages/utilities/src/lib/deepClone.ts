import type { Constructor } from '@flowr/types';
import { isPrimitive } from './isPrimitive';

/**
 * A constant reference to the prototype of a `TypedArray` to avoid recomputing the expensive
 * `Object.getPrototypeOf` call.
 *
 * We can safely reference `NodeJS.TypedArray` while preserving browser compatibility,
 * because this is TypeScript-only code and this constant is also not included
 * in the `.d.ts` file as it is not exported.
 */
const TypedArrayPrototype = Object.getPrototypeOf(Uint8Array) as Constructor<NodeJS.TypedArray>;

/**
 * Deep clone an object
 * @param source The object to clone
 */
export function deepClone<Type>(source: Type): Type {
	if (source === null || isPrimitive(source))
		return source;

	if (source instanceof Date) {
		const output = new (source.constructor as DateConstructor)(source);

		return output as Type;
	}

	if (source instanceof TypedArrayPrototype) {
		const output = (source.constructor as Uint8ArrayConstructor).from(source as Uint8Array);

		return output as Type;
	}

	if (Array.isArray(source)) {
		const output = new (source.constructor as ArrayConstructor)(source.length) as Type & Type extends Array<infer Source> ? Source[] : never;

		for (let i = 0; i < source.length; i++)
			output[i] = deepClone(source[i]);

		return output as Type;
	}

	if (source instanceof Map) {
		const output = new (source.constructor as MapConstructor)() as Type & Type extends Map<infer Key, infer Value> ? Map<Key, Value> : never;

		for (const [key, value] of source.entries())
			output.set(key, deepClone(value));

		return output as Type;
	}

	if (source instanceof Set) {
		const output = new (source.constructor as SetConstructor)() as Type & Type extends Set<infer Key> ? Set<Key> : never;

		for (const value of source.values())
			output.add(deepClone(value));

		return output as Type;
	}

	if (typeof source === 'object') {
		const output = new ((source as Type & (object | Record<PropertyKey, unknown>)).constructor as ObjectConstructor)() as Record<PropertyKey, unknown>;

		for (const [key, value] of Object.entries(source))
			Object.defineProperty(output, key, {
				configurable: true,
				enumerable: true,
				value: deepClone(value),
				writable: true,
			});

		return output as Type;
	}

	return source;
}
