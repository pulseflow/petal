/**
 * Represents an accessor method's property descriptor. which may only have a
 * getter and/or setter, a `configurable` flag, and an `enumerable` flag. The
 * `value` and `writable` flags are not allowed.
 *
 * @template T The type of the accessor's value.
 * @category Types
 */
export interface AccessorPropertyDescriptor<T = any> {
	get?: () => T;
	set?: (value: T) => void;
	configurable?: boolean;
	enumerable?: boolean;
}
