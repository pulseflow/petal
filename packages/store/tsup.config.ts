import { createTsupConfig } from '../scripts/tsup.config.js';

export default createTsupConfig('store', { iifeOptions: { disabled: true } });
