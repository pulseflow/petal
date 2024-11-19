import { createTsupConfig } from '../scripts/tsup.config.ts';

export default createTsupConfig('metadata', { iife: { disabled: true } });
