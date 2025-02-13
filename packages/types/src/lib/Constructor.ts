/**
 * Represents a constructor function that can be used to create new instances
 * of a given type {@linkcode T}. Similar to {@linkcode AbstractConstructor},
 * but this represents a concrete class instead of an abstract one.
 *
 * Values of this type are subtypes of {@linkcode AbstractConstructor}.
 *
 * @template [T=any] The type of the instances created by the constructor.
 * @template {readonly unknown[]} [A=readonly any[]] The type of the arguments
 * passed to the constructor.
 * @category Utility Types
 */
export interface Constructor<T = any, A extends readonly unknown[] = readonly any[]> {
	new(...args: A): T;
}
