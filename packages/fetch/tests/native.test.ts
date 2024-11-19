import type { QueryError } from '../src/lib/error';
import { Buffer } from 'node:buffer';
import { URL as NodeUrl } from 'node:url';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { fetch } from '../src/lib/fetch';
import { FetchMediaContentTypes, FetchMethods, FetchResultTypes } from '../src/lib/types';

describe('fetch', () => {
	const server = setupServer(
		http.get('http://localhost/simpleget', () => HttpResponse.json({ test: true }, { status: 200 })),
		http.post('http://localhost/simplepost', async ({ request }) => {
			const body = await request.json();
			if (body && typeof body === 'object' && body.petal === 'isAwesome')
				return HttpResponse.json({ test: true }, { status: 200 });

			return HttpResponse.json({ test: false }, { status: 400 });
		}),
		http.get('http://localhost/404', () => HttpResponse.json({ success: false }, { status: 404 })),
		http.post('http://localhost/upload', async ({ request }) => {
			try {
				await request.json();
				return HttpResponse.json({ message: 'Successfully parsed body as JSON, this is unexpected!!' }, { status: 200 });
			}
			catch {
				return HttpResponse.json({ message: `Failed to parse body as JSON, this is expected!!` }, { status: 200 });
			}
		}),
	);

	beforeAll(() => server.listen());
	afterEach(() => server.resetHandlers());
	afterAll(() => server.close());

	describe('successful fetches', () => {
		it('given fetch w/ JSON response then returns JSON', async () => {
			const response = await fetch<{ test: boolean }>('http://localhost/simpleget', FetchResultTypes.JSON);

			expect(response.test).toBe(true);
		});

		it('given fetch w/o options w/ JSON response then returns JSON', async () => {
			const response = await fetch<{ test: boolean }>('http://localhost/simpleget');

			expect(response.test).toBe(true);
		});

		it('given fetch w/o options w/ JSON response then returns', async () => {
			const response = await fetch<{ test: boolean }>(
				'http://localhost/simpleget',
				{ headers: { accept: 'application/json' } },
				FetchResultTypes.JSON,
			);

			expect(response.test).toBe(true);
		});

		it('given fetch w/ options w/ No Response then returns JSON', async () => {
			const response = await fetch<{ test: boolean }>('http://localhost/simpleget', {
				headers: { accept: 'application/json' },
			});

			expect(response.test).toBe(true);
		});

		it('given fetch w/ Result Response then returns Result', async () => {
			const response = await fetch('http://localhost/simpleget', FetchResultTypes.Result);

			expect(response.ok).toBe(true);
			expect(response.bodyUsed).toBe(false);
		});

		it('given fetch w/ Buffer Response then returns Buffer', async () => {
			const response = await fetch('http://localhost/simpleget', FetchResultTypes.Buffer);

			expect(response).toStrictEqual(Buffer.from(JSON.stringify({ test: true })));
		});

		it('given fetch w/ Buffer Response then returns', async () => {
			const response = await fetch('http://localhost/simpleget', FetchResultTypes.Blob);
			const jsonData = await response.text();

			expect(jsonData).toStrictEqual(JSON.stringify({ test: true }));
		});

		it('given fetch w/ Text Response then returns raw text', async () => {
			const response = await fetch('http://localhost/simpleget', FetchResultTypes.Text);

			expect(response).toStrictEqual(JSON.stringify({ test: true }));
		});

		it('given fetch w/ NodeJS URL class then returns result', async () => {
			const url = new NodeUrl('http://localhost/simpleget');
			const response = await fetch(url, FetchResultTypes.Text);

			expect(response).toStrictEqual(JSON.stringify({ test: true }));
		});

		it('given fetch w/ Browser URL class then returns result', async () => {
			const url = new URL('http://localhost/simpleget');
			const response = await fetch(url, FetchResultTypes.Text);

			expect(response).toStrictEqual(JSON.stringify({ test: true }));
		});

		it('given fetch w/ object body w/ JSON response then returns JSON', async () => {
			const response = await fetch<{ test: boolean }>(
				'http://localhost/simplepost',
				{ body: { petal: 'isAwesome' }, method: FetchMethods.Post },
				FetchResultTypes.JSON,
			);

			expect(response.test).toBe(true);
		});

		it('given fetch w/ Blob body then returns successfully', async () => {
			const response = await fetch<{ message: string }>(
				'http://localhost/upload',
				{
					body: new Blob(['De Blob'], {
						type: FetchMediaContentTypes.TextPlain,
					}),
					method: FetchMethods.Post,
				},
				FetchResultTypes.JSON,
			);

			expect(response.message).toBe('Failed to parse body as JSON, this is expected!!');
		});

		it('given fetch w/ buffer body then returns successfully', async () => {
			const response = await fetch<{ message: string }>(
				'http://localhost/upload',
				{
					body: Buffer.alloc(1),
					method: FetchMethods.Post,
				},
				FetchResultTypes.JSON,
			);

			expect(response.message).toBe('Failed to parse body as JSON, this is expected!!');
		});
	});

	describe('unsuccessful fetches', () => {
		it('given fetch w/ unknown path then returns FetchError', async () => {
			const url = 'http://localhost/404';
			const fetchResult = fetch(url, FetchResultTypes.JSON);

			await expect(fetchResult).rejects.toThrowError(`Failed to request '${url}' with code 404.`);
			await expect(fetchResult).rejects.toBeInstanceOf(Error);

			try {
				await fetchResult;
			}
			catch (error) {
				expect((error as QueryError).message).toBe(`Failed to request '${url}' with code 404.`);
				expect((error as QueryError).body).toBe('{"success":false}');
				expect((error as QueryError).code).toBe(404);
				expect((error as QueryError).url).toBe(url);
				expect((error as QueryError).toJSON()).toStrictEqual({ success: false });
			}
		});

		it('given fetch w/ unknown path and URL object then returns FetchError', async () => {
			const url = new URL('http://localhost/404');
			const fetchResult = fetch(url, FetchResultTypes.JSON);

			await expect(fetchResult).rejects.toThrowError(`Failed to request '${url}' with code 404.`);
			await expect(fetchResult).rejects.toBeInstanceOf(Error);

			try {
				await fetchResult;
			}
			catch (error) {
				expect((error as QueryError).message).toBe(`Failed to request '${url}' with code 404.`);
				expect((error as QueryError).code).toBe(404);
				expect((error as QueryError).url).toBe(url);
				expect((error as QueryError).toJSON()).toStrictEqual({ success: false });
			}
		});

		it('given fetch w/ calling error.toJSON() twice then returns FetchError', async () => {
			const url = 'http://localhost/404';
			const fetchResult = fetch(url, FetchResultTypes.JSON);

			await expect(fetchResult).rejects.toThrowError(`Failed to request '${url}' with code 404.`);
			await expect(fetchResult).rejects.toBeInstanceOf(Error);

			try {
				await fetchResult;
			}
			catch (error) {
				expect((error as QueryError).toJSON()).toStrictEqual({ success: false });

				expect((error as QueryError).toJSON()).toStrictEqual({ success: false });
			}
		});

		it('given fetch w/ invalid type then throws', async () => {
			// @ts-expect-error: handling error case
			await expect(fetch('http://localhost/simpleget', 'type not found')).rejects.toThrowError('Unknown type "type not found"');
		});
	});
});

describe('fetchMediaContentTypes', () => {
	it('given Entries of FetchMediaContentTypes then returns expected entries', () => {
		const MediaTypeEntries = [...Object.entries(FetchMediaContentTypes)];

		expect(MediaTypeEntries).toHaveLength(31);
		expect(MediaTypeEntries).toStrictEqual([
			['AudioAac', 'audio/aac'],
			['AudioMp4', 'audio/mp4'],
			['AudioMpeg', 'audio/mpeg'],
			['AudioOgg', 'audio/ogg'],
			['AudioOpus', 'audio/opus'],
			['AudioVorbis', 'audio/vorbis'],
			['AudioWav', 'audio/wav'],
			['AudioWebm', 'audio/webm'],
			['FontOtf', 'font/otf'],
			['FontTtf', 'font/ttf'],
			['FontWoff', 'font/woff'],
			['FontWoff2', 'font/woff2'],
			['FormData', 'multipart/form-data'],
			['FormURLEncoded', 'application/x-www-form-urlencoded'],
			['ImageAPNG', 'image/apng'],
			['ImageGIF', 'image/gif'],
			['ImageJPEG', 'image/jpeg'],
			['ImagePNG', 'image/png'],
			['ImageWEBP', 'image/webp'],
			['JSON', 'application/json'],
			['JavaScript', 'application/javascript'],
			['OctetStream', 'application/octet-stream'],
			['TextCSS', 'text/css'],
			['TextHTML', 'text/html'],
			['TextPlain', 'text/plain'],
			['VideoH264', 'video/h264'],
			['VideoH265', 'video/h265'],
			['VideoMp4', 'video/mp4'],
			['VideoOgg', 'video/ogg'],
			['VideoWebm', 'video/webm'],
			['XML', 'application/xml'],
		]);
	});
});
