import React from 'react';

import { Component } from './Component';
import { describe, it, expect } from 'vitest';

describe('testing JSX in tests', () => {
	it('does not throw', () => {
		expect(() => <Component />).not.toThrow();
	});
});
