import type { Arrayable } from '@flowr/types';

export const getDimension = <Type>(arr: Arrayable<Type>, dimension = 0): number => Array.isArray(arr) ? getDimension(arr[0], dimension + 1) : dimension;
