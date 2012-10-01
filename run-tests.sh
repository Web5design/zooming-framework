#!/bin/bash

# Copyright 2012 Ben Vanik. All Rights Reserved.

# Run tests quickly.
# This requires up-to-date deps files, produced by 'anvil build :deps'.
#
# If trying to test in an automated environment, prefer using the :test rule:
#   anvil build :test

GREP="$1"
if [ -z $GREP ]; then
  GREP=""
  echo "Running all tests..."
else
  echo "Running tests matching '$GREP'..."
fi

find src/ -name *_test.js -print | xargs \
node_modules/mocha/bin/mocha \
    --ui tdd \
    --reporter dot \
    --require src/zf/bootstrap/mocha.js \
    --grep "$GREP"
