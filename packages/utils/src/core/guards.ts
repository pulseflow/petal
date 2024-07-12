/**
 * Type guard to filter out null-ish values
 *
 * @category Guards
 * @example [array].filter(notNullish)
 */
export const notNullish = <T>(v: T | null | undefined): v is NonNullable<T> => v != null;

/**
 * Type guard to filter out null values
 *
 * @category Guards
 * @example [array].filter(notNull)
 */
export const notNull = <T>(v: T | null): v is Exclude<T, null> => v !== null;

/**
 * Type guard to filter out null-ish values
 *
 * @category Guards
 * @example [array].filter(notUndefined)
 */
export const notUndefined = <T>(v: T): v is Exclude<T, undefined> => v !== undefined;

/**
 * Type guard to filter out falsy values
 *
 * @category Guards
 * @example [array].filter(isTruthy)
 */
export const isTruthy = <T>(v: T): v is NonNullable<T> => Boolean(v);
