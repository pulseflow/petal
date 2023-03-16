import { join } from 'path';
import { getConsumingRoot } from '@flowr/petal-utils';

export const CONSUMING_ROOT = getConsumingRoot();
export const THIS_ROOT = join(__dirname, '..');
export const CONFIG_FOLDER = join(THIS_ROOT, 'config');
export const ESLINT_CONFIG = join(CONFIG_FOLDER, 'eslintrc.js');
export const PRETTIER_CONFIG = join(CONFIG_FOLDER, 'prettier.config.js');
export const TSCONFIG = join(CONFIG_FOLDER, 'tsconfig.json');
export const JEST_CONFIG = join(CONFIG_FOLDER, 'jest.config.js');
export const COMMITLINT_CONIFG = join(CONFIG_FOLDER, 'commitlint.config.js');
export const LINT_STAGED_CONFIG = join(CONFIG_FOLDER, 'lint-staged.config.js');
