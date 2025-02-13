import type { IterableResolvable } from './from.ts';
import { from } from './from.ts';
import { assertPositive } from './shared/_assertPositive.ts';
import { makeIterableIterator } from './shared/_makeIterableIterator.ts';
import { toIntegerOrInfinityOrThrow } from './shared/_toIntegerOrInfinityOrThrow.ts';

/**
 * Creates an iterator starting at the same point, but stepping by the given amount at each iteration.
 *
 * @param iterable An iterator to map over.
 * @param step A positive integer representing the step to take at each iteration.
 *
 * @example
 * ```typescript
 * import { stepBy } from '@petal/iterator';
 *
 * const iterable = [0, 1, 2, 3, 4, 5];
 * console.log([...stepBy(iterable, 2)]);
 * // Output: [0, 2, 4]
 * ```
 *
 * @remarks
 *
 * The first element of the iterator will always be returned, regardless of the step given.
 */
export function stepBy<const ElementType>(iterable: IterableResolvable<ElementType>, step: number): IterableIterator<ElementType> {
	step = assertPositive(toIntegerOrInfinityOrThrow(step), step);

	const iterator = from(iterable);
	return makeIterableIterator<ElementType>(() => {
		const result = iterator.next();
		if (result.done)
			return { done: true, value: undefined };

		for (let i = 0; i < step - 1; i++) {
			const result = iterator.next();
			if (result.done)
				break;
		}

		return { done: false, value: result.value };
	});
}
