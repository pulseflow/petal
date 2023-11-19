import { stat as statFS } from 'node:fs';
import { promisify } from 'node:util';
const stat = promisify(statFS);
import * as paths from './paths.js';

test('Paths are exported and exist', async () => {
	expect(await stat(paths.CONSUMING_ROOT)).toBeTruthy();
	expect(await stat(paths.THIS_ROOT)).toBeTruthy();
	expect(await stat(paths.ESLINT_CONFIG)).toBeTruthy();
	expect(await stat(paths.TSCONFIG)).toBeTruthy();
});
