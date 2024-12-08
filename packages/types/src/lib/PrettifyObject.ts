/**
 * An utility type that fuses intersections of objects.
 *
 * @example
 *
 * ```typescript
 * type Objects = {
 * 	foo: string;
 * 	bar: number;
 * } & {
 * 	hello: boolean;
 * 	world: bigint;
 * };
 *
 * type PrettyObjects = PrettifyObject<Objects>;
 * // {
 * //   foo: string;
 * //   bar: number;
 * //   hello: boolean;
 * //   world: bigint
 * // }
 * ```
 */
export type PrettifyObject<T extends object> = {
	[K in keyof T]: T[K];
};
