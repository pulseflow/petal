/**
 * The QueryError class which is thrown by the {@link fetch} method.
 *
 * @see [MDN Reference](https://developer.mozilla.org/docs/Web/API/fetch)
 */
export class QueryError extends Error {
	/** The requested url. */
	public readonly url: URL | string;
	/** The HTTP status code. */
	public readonly code: number;
	/** The returned response body as a string */
	public readonly body: string;
	/** The original {@link Response} object */
	public readonly response: Response;

	#json: unknown;

	public constructor(url: URL | string, code: number, response: Response, body: string) {
		super(`Failed to request '${url}' with code ${code}.`);
		this.url = url;
		this.code = code;
		this.body = body;
		this.response = response;
		this.#json = null;
	}

	public toJSON(): unknown {
		return this.#json ?? (this.#json = JSON.parse(this.body));
	}
}
