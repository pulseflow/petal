import { createVitestConfig } from '../scripts/vitest.config.ts';

export default createVitestConfig(`store`, {
	test: {
		coverage: {
			exclude: ['./src/lib/types/base/DuplexBuffer.ts', './src/lib/types/base/IType.ts'],
		},
	},
});
