import { stat as statFS } from 'node:fs';
import { promisify } from 'node:util';
import { expect, it } from 'vitest';
import * as paths from '../lib/paths.js';

const stat = promisify(statFS);

it('paths are exported and exist', async () => {
	expect(await stat(paths.CONSUMING_ROOT)).toBeTruthy();
	expect(await stat(paths.THIS_ROOT)).toBeTruthy();
	expect(await stat(paths.ESLINT_CONFIG)).toBeTruthy();
	expect(await stat(paths.TSCONFIG)).toBeTruthy();
});
