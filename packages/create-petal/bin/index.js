#!/usr/bin/env node
import('../dist/index.mjs')
	.then(({ main }) => main());
