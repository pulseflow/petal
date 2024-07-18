import { flattenArrayable } from './array';

export const clamp = (n: number, min: number, max: number): number => Math.min(max, Math.max(min, n));
export const sum = (...args: number[] | number[][]): number => flattenArrayable(args).reduce((a, b) => a + b, 0);

/**
 * Linearly interpolates between `min` and `max` based on `t`
 *
 * @category Math
 * @param min The minimum value
 * @param max The maximum value
 * @param t The interpolation value clamped between 0 and 1
 * @example
 * ```
 * const value = lerp(0, 2, 0.5) // value will be 1
 * ```
 */
export const lerp = (min: number, max: number, t: number): number => min + (max - min) * clamp(t, 0.0, 1.0);

/**
 * Linearly remaps a clamped value from its source range [`inMin`, `inMax`] to the destination range [`outMin`, `outMax`]
 *
 * @category Math
 * @example
 * ```
 * const value = remap(0.5, 0, 1, 200, 400) // value will be 300
 * ```
 */
export function remap(n: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
	const interpolation = (n - inMin) / (inMax - inMin);
	return lerp(outMin, outMax, interpolation);
}

export function mod(a: bigint, b: bigint): bigint;
export function mod(a: number, b: number): number;
export function mod(a: any, b: any): any {
	return ((a % b) + b) % b;
}
