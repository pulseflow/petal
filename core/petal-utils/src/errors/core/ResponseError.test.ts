import type { ErrorResponseBody } from '../model/index.js';
import { ResponseError } from './ResponseError.js';

describe('responseError', () => {
	it('constructs itself from a response', async () => {
		const body: ErrorResponseBody = {
			error: { name: 'Fours', message: 'Expected fives', stack: 'lines' },
			request: { method: 'GET', url: '/' },
			response: { statusCode: 444 },
		};

		const response: Partial<Response> = {
			status: 444,
			statusText: 'Fours',
			text: async () => JSON.stringify(body),
			headers: new Headers({ 'Content-Type': 'application/json' }),
		};

		const e = await ResponseError.fromResponse(response as Response);
		expect(e.name).toEqual('ResponseError');
		expect(e.message).toEqual('Request failed with 444 Fours');
		expect(e.cause.name).toEqual('Fours');
		expect(e.cause.message).toEqual('Expected fives');
		expect(e.cause.stack).toEqual('lines');
	});
});
