import { codeBlock } from '../src';

const zeroWidthSpace = String.fromCharCode(8203);

describe('codeBlock', () => {
	it('given expression w/o length then returns wrapped ZeroWidthSpace', () => {
		expect(codeBlock('md', '')).toStrictEqual(`\`\`\`md

\`\`\`` as const);
	});

	it('given expression w/ length then returns expressed wrapped in markdown', () => {
		expect(codeBlock('md', '# Header')).toStrictEqual(`\`\`\`md
# Header
\`\`\`` as const);
	});

	it('given expression w/ length w/ inner code block then returns expressed wrapped in markdown', () => {
		expect(
			codeBlock(
				'md',
				`
			# Header
			\`\`\`js
				if (flowr) return 'awesome!';
			\`\`\`
		`,
			),
		).toStrictEqual(
			`\`\`\`md

			# Header
			\`${zeroWidthSpace}\`\`js
				if (flowr) return 'awesome!';
			\`\`\`
		
\`\`\`` as const,
		);
	});

	it('given expression w/ length w/ inner inline code block then returns expressed wrapped in markdown', () => {
		expect(
			codeBlock(
				'md',
				`
			# Header
			\`const flowr = true\`
		`,
			),
		).toStrictEqual(`\`\`\`md

			# Header
			\`const flowr = true\`
		
\`\`\`` as const);
	});

	it('given expression of non-string type then returns wrapped expression', () => {
		// @ts-expect-error: Checking for invalid input
		expect(codeBlock('md', 123456789)).toStrictEqual(`\`\`\`md
123456789
\`\`\`` as const);
	});

	it('given expression of falsey type then returns wrapped expression', () => {
		// @ts-expect-error: Checking for invalid input
		expect(codeBlock('md', false)).toStrictEqual(`\`\`\`md
false
\`\`\`` as const);
	});
});
