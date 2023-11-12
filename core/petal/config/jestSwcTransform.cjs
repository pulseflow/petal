const { createTransformer: createSwcTransformer } = require('@swc/jest');

const ESM_REGEX = /\b(?:import|export)\b/;

function createTransformer(config) {
	const swcTransformer = createSwcTransformer(config);
	const process = (source, filePath, jestOptions) => {
		if (filePath.endsWith('.js') && !ESM_REGEX.test(source)) {
			return { code: source };
		}

		return swcTransformer.process(source, filePath, jestOptions);
	};

	const getCacheKey = swcTransformer.getCacheKey;

	return { process, getCacheKey };
}

module.exports = { createTransformer };
