import type { Constructor } from '@flowr/types';

/**
 * Verify if the input is an object literal (or class).
 * @param input The object to verify
 * @param constructorType The type of the constructor of the object. Use this if you want a `class` of your choosing to pass the check as well.
 */
export function isObject(input: unknown, constructorType?: ObjectConstructor): input is object;
export function isObject<Constructable extends Constructor<unknown>>(input: unknown, constructorType: Constructable): input is InstanceType<Constructable>;
export function isObject<Constructable extends Constructor<unknown> = ObjectConstructor>(input: unknown, constructorType?: Constructable): input is object {
	return typeof input === 'object' && input ? input.constructor === (constructorType ?? Object) : false;
}
