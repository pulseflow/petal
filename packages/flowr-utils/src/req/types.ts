export type BodyType = 'json' | 'buffer' | 'form' | 'multipart';
export type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
export type AuthType = 'Bearer' | 'Basic';
export type Followup = 'then' | 'catch' | 'finally';

export type Key = string | number | symbol;
export type Tuples<K extends Key, V> = [K, V][];
export type RecordOrTuples<K extends string, V> =
	| Partial<Record<K, V>>
	| Tuples<K, V>
	| Map<K, V>;
export interface EncodeOptions { encodeQuery?: boolean }
export type Options = RequestInit & EncodeOptions;
export type Finalizer<T> = (res: Response) => Promise<T>;

export interface ResponseClass extends Response {
	headers: Headers & Record<string, string>;
}
