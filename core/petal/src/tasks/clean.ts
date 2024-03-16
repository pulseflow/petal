import path from 'node:path';
import fs from 'fs-extra';
import { CONSUMING_ROOT } from '../lib/paths.js';

export async function cleanTask() {
	await fs.remove(path.join(CONSUMING_ROOT, 'dist'));
	await fs.remove(path.join(CONSUMING_ROOT, 'build'));
	await fs.remove(path.join(CONSUMING_ROOT, 'types'));
	await fs.remove(path.join(CONSUMING_ROOT, 'node_modules'));
}
