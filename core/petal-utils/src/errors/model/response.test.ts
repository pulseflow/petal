import type { ErrorResponseBody } from './response.js';
import { parseErrorResponseBody } from './response.js';

describe('parseErrorResponseBody', () => {
	it('handles the happy path', async () => {
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

		await expect(
			parseErrorResponseBody(response as Response),
		).resolves.toEqual(body);
	});

	it('uses request header and text body when wrong content type, even if parsable', async () => {
		const body: ErrorResponseBody = {
			error: { name: 'Threes', message: 'Expected twos' },
			request: { method: 'GET', url: '/' },
			response: { statusCode: 333 },
		};

		const response: Partial<Response> = {
			status: 444,
			statusText: 'Fours',
			text: async () => JSON.stringify(body),
			headers: new Headers({
				'Content-Type': 'not-application/not-json',
			}),
		};

		await expect(
			parseErrorResponseBody(response as Response),
		).resolves.toEqual({
			error: {
				name: 'Error',
				message: `Request failed with status 444 Fours, ${JSON.stringify(
					body,
				)}`,
			},
			response: { statusCode: 444 },
		});
	});

	it('uses request header and text body when not parsable', async () => {
		const body: ErrorResponseBody = {
			error: { name: 'Threes', message: 'Expected twos' },
			request: { method: 'GET', url: '/' },
			response: { statusCode: 333 },
		};

		const response: Partial<Response> = {
			status: 444,
			statusText: 'Fours',
			text: async () => JSON.stringify(body).substring(1),
			headers: new Headers({ 'Content-Type': 'application/json' }),
		};

		await expect(
			parseErrorResponseBody(response as Response),
		).resolves.toEqual({
			error: {
				name: 'Error',
				message: `Request failed with status 444 Fours, ${JSON.stringify(
					body,
				).substring(1)}`,
			},
			response: { statusCode: 444 },
		});
	});

	it('uses request header when failing to get body', async () => {
		const response: Partial<Response> = {
			status: 444,
			statusText: 'Fours',
			text: async () => {
				throw new Error('bail');
			},
			headers: new Headers({ 'Content-Type': 'application/json' }),
		};

		await expect(
			parseErrorResponseBody(response as Response),
		).resolves.toEqual({
			error: {
				name: 'Error',
				message: `Request failed with status 444 Fours`,
			},
			response: { statusCode: 444 },
		});
	});
});
