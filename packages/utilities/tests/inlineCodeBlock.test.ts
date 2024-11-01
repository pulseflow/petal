import { inlineCodeBlock } from '../src';

describe('inlineCodeblock', () => {
	it('given text then converts to inline codeblock', () => {
		expect(inlineCodeBlock('const flowr = true')).toEqual('`const flowr = true`');
	});
});
