import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
	rootDir: join(process.cwd(), 'src'),
	coverageDirectory: join(process.cwd(), 'coverage'),
	collectCoverageFrom: ['**/*.{js,jsx,ts,tsx}', '!**/*.d.ts'],
	extensionsToTreatAsEsm: ['.ts'],
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
	setupFiles: [join(__dirname, './jest.setup.js')],
	transform: {
		'^.+\\.m?[tj]sx?$': [
			'ts-jest',
			{
				tsconfig: {
					allowJs: true,
				},
				useESM: true,
			},
		],
	},
};

export default config;
