import { Hooks } from "@yarnpkg/core";
import { config } from "dotenv";
import { existsSync } from "fs";
import { dirname, join, resolve, parse } from "path";

var interpolateValue = function (doteEnvConfig, envValue, environment) {
  const matches = envValue.match(/(.?\${?(?:[a-zA-Z0-9_]+)?}?)/g) || [];

  return matches.reduce(function (newEnv, match) {
    const parts = /(.?)\${?([a-zA-Z0-9_]+)?}?/g.exec(match)!;
    const prefix = parts[1];

    let value, replacePart;

    if (prefix === "\\") {
      replacePart = parts[0];
      value = replacePart.replace("\\$", "$");
    } else {
      var key = parts[2];
      replacePart = parts[0].substring(prefix.length);
      // process.env value 'wins' over .env file's value
      value = environment.hasOwnProperty(key)
        ? environment[key]
        : doteEnvConfig[key] || "";

      // Resolve recursive interpolations
      value = interpolateValue(doteEnvConfig, value, newEnv);
    }

    return newEnv.replace(replacePart, value);
  }, envValue);
};

const interpolateConfig = (doteEnvConfig: any, environment: any) => {
  const newConfig = { ...doteEnvConfig.parsed };
  for (const configKey in doteEnvConfig.parsed) {
    const value = environment.hasOwnProperty(configKey)
      ? environment[configKey]
      : doteEnvConfig.parsed[configKey];

    newConfig[configKey] = interpolateValue(doteEnvConfig, value, environment);
  }

  return newConfig;
};

export const hooks: Hooks = {
  async setupScriptEnvironment(project, scriptEnv) {
    const nodeEnv = process.env.NODE_ENV || "development";

    const envFiles = [];
    const projectRoot = resolve(project.cwd);
    let cwd = resolve(scriptEnv.INIT_CWD) ?? process.cwd();
    const { root } = parse(cwd);

    do {
      for (const ext of [".local", `.${nodeEnv}`, ""]) {
        const envFile = join(cwd, `.env${ext}`);
        if (existsSync(envFile)) envFiles.push(envFile);
      }

      cwd = dirname(cwd);
    } while (cwd !== dirname(projectRoot) && cwd !== root);

    for (const envFile of envFiles.reverse()) {
      const newEnv = interpolateConfig(config({ path: envFile }), scriptEnv);
      Object.assign(scriptEnv, newEnv);
    }
  },
};
