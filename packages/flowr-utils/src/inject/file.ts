import { fileURLToPath } from 'node:url';
import { findPaths } from '../index';

export const __dirname = fileURLToPath(new URL('.', import.meta.url));
export const __filename = fileURLToPath(import.meta.url);
export const paths = findPaths(__dirname);
