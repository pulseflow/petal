export const REFDIR_STATUS: number[] = [301, 302, 303, 307, 308];
export const DEF_REFDIR_COUNT = 21;
export const DEF_TIMEOUT = 30_000;
export const METHODS_SUPPORTED = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'] as const;
export const SYM_STATUS: unique symbol = Symbol.for('@flowr/utils/fetch:response:status_code');

export type Method = typeof METHODS_SUPPORTED[number];
export type WithStatus<T> = T & { [SYM_STATUS]: number };
