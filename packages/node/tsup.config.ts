import { createTsupConfig } from '../scripts/tsup.config.js';

export default createTsupConfig('node', { iifeOptions: { disabled: true } });
