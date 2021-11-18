#!/usr/bin/env bash
set -euo pipefail
shopt -s inherit_errexit

export NODE_ENV=test
echo "Testing upper scope... "
yarn node ./test.js && echo "OK"

echo "Testing 'test1'... "
yarn workspace test1 exec node ./test.js && echo "OK"

echo "Testing 'test2'... "
yarn workspace test2 exec node ./test.js && echo "OK"
