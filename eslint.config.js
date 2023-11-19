// @ts-check
import petal from '@flowr/eslint-config';

export default petal({
	typescript: true,
	jest: true,
	ignores: [
		'fixtures',
		'_fixtures',
	],
});
