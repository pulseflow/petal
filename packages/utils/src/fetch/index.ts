import type { RequestProxy } from './chaining';
import type { WrappedResponse } from './finalizers';
import type { Options } from './request';
import { proxy } from './chaining';
import { toDefault } from './finalizers';
import { RequestBuilder } from './request';

declare global {
	interface Response {
		json: <T = any>() => Promise<T>;
	}
}

export function req(url: string | URL, options?: Options): RequestProxy<WrappedResponse> {
	return proxy(new RequestBuilder(url, toDefault, options));
}

export { SYM_STATUS as status } from './const';
