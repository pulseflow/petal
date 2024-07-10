import type { Options } from './request';
import { RequestBuilder } from './request';
import type { RequestProxy } from './chaining';
import { proxy } from './chaining';
import type { WrappedResponse } from './finalizers';
import { toDefault } from './finalizers';

declare global {
	interface Response {
		json: <T = any>() => Promise<T>;
	}
}

export function req(url: string | URL, options?: Options): RequestProxy<WrappedResponse> {
	return proxy(new RequestBuilder(url, toDefault, options));
}

export { SYM_STATUS as status } from './const';
