import { createTsupConfig } from '../scripts/tsup.config.ts';

export default createTsupConfig('store', { iife: { disabled: true } });
