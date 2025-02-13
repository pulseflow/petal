import type { BRAND } from './brand.ts';

/**
 * Represents a unique flavor for a type, which can be used to create nominal
 * types in TypeScript and prevent type collisions. For a stricter version of
 * this type, see the {@linkcode Brand} interface.
 *
 * To create a flavored type, you can either use the {@linkcode Flavored}
 * helper type, or manually extend/intersect another type with this interface.
 * The {@linkcode F} type parameter is the type that becomes the flavor's
 * value, and it defaults to `never`.
 */
export interface Flavor<F = never> {
	readonly [BRAND]?: F | void;
}
