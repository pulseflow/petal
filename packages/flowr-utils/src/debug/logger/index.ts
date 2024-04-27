import { pad, reg_scope } from './config';
import { log } from './log';
import type { Options } from './types';

const init: Options = { align: false };
const default_logger = (...scopes: string[]) => log(init, ...scopes);

Object.defineProperty(default_logger, 'inform', { value: reg_scope });
Object.defineProperty(default_logger, 'pad', { value: pad });

export const logger = default_logger as typeof default_logger & {
	inform: typeof reg_scope;
	pad: typeof pad;
};
