import es5 from './es5.js';
import es6 from './es6.js';

/** @type {import('eslint').Linter.FlatConfig} */
export default {
	...es5,
	...es6,
	files: ['.ts', '.js', '.tsx', '.jsx'],
	ignores: ['build/', 'types/'],
};
