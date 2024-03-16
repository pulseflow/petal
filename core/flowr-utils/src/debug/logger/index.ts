import { configurePadding, informScope } from './config.js';
import { log } from './log.js';
import type { Options } from './types.js';

const init: Options = { align: false };
const _logger = (...scopes: string[]) => log(init, ...scopes);

Object.defineProperty(_logger, 'inform', { value: informScope });
Object.defineProperty(_logger, 'pad', { value: configurePadding	});

export const logger = _logger as typeof _logger & {
	inform: typeof informScope;
	pad: typeof configurePadding;
};
