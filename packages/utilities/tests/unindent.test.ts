import { unindent } from '../src';

it('unindent', () => {
	expect(
		unindent`
		if (a) {
		  b()
		}
	  `,
	).toMatchSnapshot('base');

	expect(
		unindent`
			if (a) {
		  b()
		}
	  `,
	).toMatchSnapshot('with leading indent');

	expect(
		unindent`
  
			if (a) {
		  b()
		}
  
	  `,
	).toMatchSnapshot('multi-start and end');

	expect(
		unindent`if (a) {
	b()
  }`,
	).toMatchSnapshot('no start or end');

	expect(
		unindent`
					if (a) {
					b()
				}
	  `,
	).toMatchSnapshot('indent deep');
});
