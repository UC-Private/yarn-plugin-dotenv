const assert = require("assert").strict;
const { env } = require("process");

assert.equal(
  env.VARIABLE_FROM_UPPER_DIRECTORY,
  "OK",
  "Variable from upper directory not available"
);
