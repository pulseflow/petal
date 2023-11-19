import { resolve } from 'node:path';
import process from 'node:process';

export const getConsumingRoot = () => resolve(process.cwd());
