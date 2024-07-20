import tsParser from '@typescript-eslint/parser';
import type { RuleTesterInitOptions, TestCasesOptions } from 'eslint-vitest-rule-tester';
import { run as _run } from 'eslint-vitest-rule-tester';

export { unindent as $ } from 'eslint-vitest-rule-tester';

export type ExtendedRuleTesterOptions = TestCasesOptions & RuleTesterInitOptions & { lang?: 'js' | 'ts' };

export function run(options: ExtendedRuleTesterOptions): void {
	_run({
		parser: tsParser as any,
		...options,
	});
}
