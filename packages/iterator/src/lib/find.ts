import type { IterableResolvable } from './from.ts';
import { filter } from './filter.ts';
import { first } from './first.ts';

/**
 * Advances the iterable until it finds the element, returning it if it's found and `undefined` otherwise.
 *
 * @param iterable An iterator to search for a value in.
 * @param cmp A function that determines if a value is the one being searched for.
 * @returns The first element found that matches {@link cmp}
 *
 * @example
 * ```typescript
 * import { find } from '@flowr/iterator';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log(find(iterable, (value) => value % 2 === 0));
 * // Output: 2
 * ```
 *
 * @remarks This function consumes the iterator until the value is found or the iterator is exhausted.
 */
export function find<const ElementType, const FilteredType extends ElementType>(
	iterable: IterableResolvable<ElementType>,
	cmp: (element: ElementType, index: number) => element is FilteredType
): FilteredType | undefined;
export function find<const ElementType>(
	iterable: IterableResolvable<ElementType>,
	cmp: (element: ElementType, index: number) => boolean
): ElementType | undefined;
export function find<const ElementType>(
	iterable: IterableResolvable<ElementType>,
	cmp: (element: ElementType, index: number) => boolean,
): ElementType | undefined {
	return first(filter(iterable, cmp));
}
