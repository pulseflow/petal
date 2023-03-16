#!/bin/bash
petal audit --help &> /dev/null

if ! [ $? -eq 0 ]; then
    echo "Bootstrapping Petal..."
    pnpm lerna run bootstrap
fi

petal audit