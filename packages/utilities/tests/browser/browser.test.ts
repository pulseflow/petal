// @vitest-environment jsdom

import type { DOMWindow } from 'jsdom';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { join } from 'pathe';

describe('browser-bundle-test', () => {
	let window: DOMWindow;

	beforeAll(async () => {
		window = new JSDOM(
			`
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta http-equiv="X-UA-Compatible" content="IE=edge">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>BrowserBundleTest</title>
					<script>${await readFile(join(import.meta.dirname, '../../dist/iife/index.global.js'), 'utf8')}</script>
				</head>
				<body></body>
				</html>
			`,
			{
				runScripts: 'dangerously',
			},
		).window;
	});

	it('stopwatch should be available in window', () => {
		expect(new window.PulseUtilities.Stopwatch().stop().toString()).toBeDefined();
	});
});
