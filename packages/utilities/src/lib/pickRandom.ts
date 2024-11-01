/**
 * Picks a random element from an array
 * @param array The array to pick a random element from
 * @param amount Amount of values to obtain randomly (default: 1)
 */
export function pickRandom<ArrayType>(array: readonly ArrayType[], amount?: 1): ArrayType;
export function pickRandom<ArrayType>(array: readonly ArrayType[], amount: number): ArrayType[];
export function pickRandom<ArrayType>(array: readonly ArrayType[], amount = 1): ArrayType | ArrayType[] {
	const arr = [...array];

	if (typeof amount === 'undefined' || amount === 1)
		return arr[Math.floor(Math.random() * arr.length)];

	if (!arr.length || !amount)
		return [];

	return Array.from({ length: Math.min(amount, arr.length) }, () => arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
}
