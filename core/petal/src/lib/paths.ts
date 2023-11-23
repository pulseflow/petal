import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getConsumingRoot } from '@flowr/petal-utils';

export const CONSUMING_ROOT = getConsumingRoot();
const __dirname = fileURLToPath(new URL('.', import.meta.url));
export const THIS_ROOT = join(__dirname, '..');
export const CONFIG_FOLDER = join(THIS_ROOT, 'config');
export const ESLINT_CONFIG = join(CONFIG_FOLDER, 'eslint.config.js');
export const TSCONFIG = join(CONFIG_FOLDER, 'tsconfig.json');
