import type { ConsumedResponse } from '../core/types.js';
import type { SerializedError } from './error.js';

/**
 * A standard shape of JSON data returned as the body of backend errors.
 *
 * @public
 */
export interface ErrorResponseBody {
	/** Details of the error that was caught */
	error: SerializedError;

	/** Details about the incoming request */
	request?: {
		/** The HTTP method of the request */
		method: string;
		/** The URL of the request (excluding protocol and host/port) */
		url: string;
	};

	/** Details about the response */
	response: {
		/** The numeric HTTP status code that was returned */
		statusCode: number;
	};
}

/**
 * Attempts to construct an ErrorResponseBody out of a failed server request.
 * Assumes that the response has already been checked to be not ok. This
 * function consumes the body of the response, and assumes that it hasn't
 * been consumed before.
 *
 * The code is forgiving, and constructs a useful synthetic body as best it can
 * if the response body wasn't on the expected form.
 *
 * @public
 * @param response - The response of a failed request
 */
export async function parseErrorResponseBody(response: ConsumedResponse & { text: () => Promise<string> }): Promise<ErrorResponseBody> {
	try {
		const text = await response.text();
		if (text) {
			if (
				response.headers
					.get('content-type')
					?.startsWith('application/json')
			) {
				try {
					const body = JSON.parse(text);
					if (body.error && body.response)
						return body;
				}
				catch {
					// ignore
				}
			}

			return {
				error: {
					name: 'Error',
					message: `Request failed with status ${response.status} ${response.statusText}, ${text}`,
				},
				response: {
					statusCode: response.status,
				},
			};
		}
	}
	catch {
		// ignore
	}

	return {
		error: {
			name: 'Error',
			message: `Request failed with status ${response.status} ${response.statusText}`,
		},
		response: {
			statusCode: response.status,
		},
	};
}
