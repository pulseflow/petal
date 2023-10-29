const { default: JestRuntime } = require('jest-runtime');

const scriptTransformCache = new Map();

module.exports = class CachingJestRuntime extends JestRuntime {
	createScriptFromCode(scriptSource, filename) {
		let script = scriptTransformCache.get(scriptSource);
		if (!script) {
			script = super.createScriptFromCode(scriptSource, filename);
			scriptTransformCache.set(scriptSource, script);
		}
		return script;
	}
};
