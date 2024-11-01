#!/usr/bin/env node
import('../dist/esm/index.js')
	.then(({ main }) => main());
