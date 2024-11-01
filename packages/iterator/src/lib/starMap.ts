import type { IterableResolvable } from './from.ts';
import { assertFunction } from './shared/_assertFunction.ts';
import { toIterableIterator } from './toIterableIterator.ts';

/**
 * Creates an iterable with the results of calling a provided function on each element of the input iterables as the function's parameters.
 *
 * @param iterable The iterable to map over.
 * @param cmp The callback function to apply to each element.
 * @returns An iterable iterator that yields the mapped elements.
 *
 * @example
 * ```typescript
 * import { starMap } from '@flowr/iterator';
 *
 * const iterable = [[1, 2], [3, 4], [5, 6]];
 * console.log([...starMap(iterable, (a, b) => a + b)]);
 * // Output: [3, 7, 11]
 * ```
 *
 * @remarks
 *
 * While very similar to {@link map}, `starMap` takes an iterable of iterables (which can be an array of tuples) and
 * calls the function with each inner iterable's values as the function's parameters. {@link map} calls the function
 * with the value and the index by comparison.
 */
export function* starMap<const ElementType extends IterableResolvable<any>, const MappedType>(
	iterable: IterableResolvable<ElementType>,
	cmp: (...args: StarMapParameters<ElementType>) => MappedType,
): IterableIterator<MappedType> {
	cmp = assertFunction(cmp);

	for (const value of toIterableIterator(iterable))
		yield cmp(...(toIterableIterator(value) as any));
}

export type StarMapParameters<ElementType> = ElementType extends readonly [...infer ElementTypeEntry]
	? ElementTypeEntry
	: ElementType extends IterableResolvable<infer ElementType>
		? ElementType[]
		: never;
