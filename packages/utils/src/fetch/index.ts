import type { Options } from './request';
import { RequestBuilder } from './request';
import { proxy } from './chaining';
import { toDefault } from './finalizers';

declare global {
	interface Response {
		json: <T = any>() => Promise<T>;
	}
}

export function req(url: string | URL, options?: Options) {
	const request = new RequestBuilder(url, toDefault, options);
	return proxy(request);
}

export { SYM_STATUS as status } from './const';
