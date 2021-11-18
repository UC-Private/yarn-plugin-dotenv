const assert = require("assert").strict;
const { env } = require("process");

assert.equal(env.VARIABLE_FROM_UPPER_DIRECTORY, "OK", ".env file not loaded");
