import { splitText } from '../src';

describe('splitText', () => {
	it('given text without spaces then hard cuts off', () => {
		expect(splitText('thistexthasnospaces', 10)).toEqual('thistextha');
	});

	it('given text with spaces then cuts off on space', () => {
		expect(splitText('thistext hasnospaces', 10)).toEqual('thistext');
	});
});
