/**
 * ConsumedResponse represents a Response that is known to have been consumed.
 * The methods and properties used to read the body contents are therefore omitted.
 *
 * @public
 */
export interface ConsumedResponse {
	readonly headers: {
		append: (name: string, value: string) => void;
		delete: (name: string) => void;
		get: (name: string) => string | null;
		has: (name: string) => boolean;
		set: (name: string, value: string) => void;
		forEach: (callback: (value: string, name: string) => void) => void;

		entries: () => IterableIterator<[string, string]>;
		keys: () => IterableIterator<string>;
		values: () => IterableIterator<string>;
		[Symbol.iterator]: () => Iterator<[string, string]>;
	};
	readonly ok: boolean;
	readonly redirected: boolean;
	readonly status: number;
	readonly statusText: string;
	readonly type: ResponseType;
	readonly url: string;
}
