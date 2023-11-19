const crypto = require('node:crypto');
const { Buffer } = require('node:buffer');
const yaml = require('yaml');

function createTransformer(config) {
	const process = (source) => {
		const json = JSON.stringify(yaml.parse(source), null, 2);
		return { code: `module.exports = ${json}`, map: null };
	};

	const getCacheKey = (sourceText) => {
		return crypto
			.createHash('md5')
			.update(sourceText)
			.update(Buffer.alloc(1))
			.update(JSON.stringify(config))
			.update(Buffer.alloc(1))
			.update('1')
			.digest('hex');
	};

	return { process, getCacheKey };
}

module.exports = { createTransformer };
