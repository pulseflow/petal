import { deserializeError } from '../model/error.js';
import type {
	ErrorResponseBody,
} from '../model/response.js';
import {
	parseErrorResponseBody,
} from '../model/response.js';
import type { ConsumedResponse } from './types.js';

/**
 * An error thrown as the result of a failed server request.
 *
 * The server is expected to respond on the ErrorResponseBody format.
 *
 * @public
 */
export class ResponseError extends Error {
	/**
	 * The actual response, as seen by the client.
	 *
	 * Note that the body of this response is always consumed. Its parsed form is
	 * in the `body` field.
	 */
	readonly response: ConsumedResponse;

	/**
	 * The parsed JSON error body, as sent by the server.
	 */
	readonly body: ErrorResponseBody;

	/**
	 * The Error cause, as seen by the remote server. This is parsed out of the
	 * JSON error body.
	 *
	 * This error always has the plain Error constructor, however all
	 * serializable enumerable fields on the remote error including its name are
	 * preserved. Therefore, if you want to check the error type, use its name
	 * property rather than checking typeof or its constructor or prototype.
	 */
	readonly cause: Error;

	/**
	 * Constructs a ResponseError based on a failed response.
	 *
	 * Assumes that the response has already been checked to be not ok. This
	 * function consumes the body of the response, and assumes that it hasn't
	 * been consumed before.
	 */
	static async fromResponse(
		response: ConsumedResponse & { text: () => Promise<string> },
	): Promise<ResponseError> {
		const data = await parseErrorResponseBody(response);

		const status = data.response.statusCode || response.status;
		const statusText = data.error.name || response.statusText;
		const message = `Request failed with ${status} ${statusText}`;
		const cause = deserializeError(data.error);

		return new ResponseError({
			message,
			response,
			data,
			cause,
		});
	}

	private constructor(props: {
		message: string;
		response: ConsumedResponse;
		data: ErrorResponseBody;
		cause: Error;
	}) {
		super(props.message);
		this.name = 'ResponseError';
		this.response = props.response;
		this.body = props.data;
		this.cause = props.cause;
	}
}
