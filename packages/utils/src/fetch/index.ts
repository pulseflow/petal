import type { Options } from './request';
import { RequestBuilder } from './request';
import { proxy } from './chaining';
import { toDefault } from './finalizers';

export const req = (url: string | URL, options?: Options) => proxy(new RequestBuilder(url, toDefault, options));

export { SYM_STATUS as status } from './const';
