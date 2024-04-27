import { stringifyError } from '../model/error';
import { isError } from './assertion';

/**
 * A base class that custom Error classes can inherit from.
 *
 * @public
 * @example
 *
 * ```ts
 * class MyCustomError extends CustomErrorBase {
 *  name = 'MyCustomError' as const;
 * }
 *
 * const e = new MyCustomError('Some message', cause);
 * // e.name === 'MyCustomError'
 * // e.message === 'Some message'
 * // e.cause === cause
 * // e.stack is set if the runtime supports it
 * ```
 */
export class CustomErrorBase extends Error {
	/**
	 * An inner error that caused this error to be thrown, if any.
	 */
	readonly cause?: Error | undefined;

	constructor(message?: string, cause?: Error | unknown) {
		let fullMessage = message;
		if (cause !== undefined) {
			const causeStr = stringifyError(cause);
			if (fullMessage)
				fullMessage += `; caused by ${causeStr}`;

			else
				fullMessage = `caused by ${causeStr}`;
		}

		super(fullMessage);

		Error.captureStackTrace?.(this, this.constructor);

		if (!this.name || this.name === 'Error') {
			const baseName = this.constructor.name;
			if (baseName !== 'Error')
				this.name = this.constructor.name;
		}

		this.cause = isError(cause) ? cause : undefined;
	}
}
