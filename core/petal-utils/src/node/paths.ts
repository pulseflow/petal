import { findPaths } from '../index.js';
import { fileURLToPath } from 'url';

export const __dirname = fileURLToPath(new URL('.', import.meta.url));
export const __filename = fileURLToPath(import.meta.url);
export const paths = findPaths(__dirname);
