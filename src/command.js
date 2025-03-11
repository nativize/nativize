export const help = () => {
  console.log("help, version, check, prepare, build... and run.");
};

export const version = () => {
  // get module version.
  console.log(
    JSON.parse(Deno.readTextFileSync(`${import.meta.dirname}/../deno.json`))
      .version,
  );
};

export const check = () => {
  console.log("check");
  //load configuration
  //if static, create configuration accordingly
  //if dynamic, import default application declaration
  //default is
  //1. config.nativize.js
  //2. config.nativize.ts
  //3. config.nativize.json
  //4. config.nativize.jsonc
  //if there are multiple configs found, emit error requiring config file specified.
};

export const prepare = () => {
  check();
  console.log("prepare");
};

export const build = () => {
  prepare();
  console.log("build");
};

export const run = () => {
  build();
  console.log("run");
};

/**
 * @param {string[]} args
 * @returns {{commands: string[], options: Object.<string, string[]> }[]}}
 */
export const parseArguments = (args) =>
  args.reduce((acc, cur) => {
    if (cur.startsWith("-")) {
      acc.options[cur] = [];
    } else {
      if (Object.entries(acc.options) != false) {
        Object.entries(acc.options).at(-1).at(1).push(cur);
      } else {
        acc.commands.push(cur);
      }
    }
    return acc;
  }, { commands: [], options: {} });
