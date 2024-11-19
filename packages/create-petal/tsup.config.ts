import { createTsupConfig } from '../scripts/tsup.config.ts';

export default createTsupConfig('create-petal', { iife: { disabled: true } });
