export const error = new Error('thrown');

export function makeThrow(): void {
	throw error;
}
