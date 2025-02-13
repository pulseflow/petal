import { createTsupConfig } from '../scripts/tsup.config.ts';

export default createTsupConfig('crypto', { iife: { disabled: true } });
