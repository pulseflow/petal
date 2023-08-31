const path = require('path');

module.exports = {
	rootDir: path.join(process.cwd(), 'src'),
	coverageDirectory: path.join(process.cwd(), 'coverage'),
	collectCoverageFrom: ['**/*.{js,jsx,ts,tsx}', '!**/*.d.ts'],
	transform: {
		'^.+\\.[tj]sx?$': [
			'ts-jest',
			{
				tsconfig: {
					allowJs: true,
				},
			},
		],
	},
};
