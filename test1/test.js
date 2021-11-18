const assert = require("assert").strict;
const { env } = require("process");

assert.equal(env.INTERPOLATED_VARIABLE, "OK", "Variable not interpolated");
assert.equal(
  env.LOCAL_VARIABLE_OVERRIDDEN,
  "OK",
  "Local variable not overridden"
);
assert.equal(
  env.VARIABLE_FOR_THE_TEST_ENVIRONMENT,
  "OK",
  "Variable for a specific environment not loaded"
);
