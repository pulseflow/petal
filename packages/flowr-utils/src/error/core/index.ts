export { assertError, isError } from './assertion';
export type { ErrorLike } from './assertion';
export {
	AuthenticationError,
	ConflictError,
	ForwardedError,
	InputError,
	NotAllowedError,
	NotFoundError,
	NotModifiedError,
	NotImplementedError,
	ServiceUnavailableError,
} from './common';
export { CustomErrorBase } from './CustomErrorBase';
export { ResponseError } from './ResponseError';
export type { ConsumedResponse } from './types';
