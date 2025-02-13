/**
 * Represents an abstract constructor function (i.e. an abstract class) that
 * **cannot** be directly instantiated, but can be extended by other classes.
 *
 * This is a supertype of the {@linkcode Constructor} type, and therefore it
 * typically can be used in place of a constructor type to represent a normal
 * concrete class as well.
 *
 * @template [T=any] The type of the instances created by the constructor.
 * @template {readonly unknown[]} [A=readonly any[]] The type of the arguments
 * passed to the constructor.
 * @category Utility Types
 */
export type AbstractConstructor<
	T = any,
	A extends readonly unknown[] = readonly any[],
> = abstract new (...args: A) => T;
