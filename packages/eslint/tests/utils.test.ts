import { parserPlain } from '../src/utils.ts';

describe('parserPlain', () => {
	it('parses plaintext', () => {
		expect(parserPlain.parseForESLint('{ "a": 1 }')).toMatchInlineSnapshot(`
      {
        "ast": {
          "body": [],
          "comments": [],
          "loc": {
            "end": 10,
            "start": 0,
          },
          "range": [
            0,
            10,
          ],
          "tokens": [],
          "type": "Program",
        },
        "scopeManager": null,
        "services": {
          "isPlain": true,
        },
        "visitorKeys": {
          "Program": [],
        },
      }
    `);
	});
});
