import { createTsupConfig } from '../scripts/tsup.config.ts';

export default createTsupConfig('node', { iife: { disabled: true } });
