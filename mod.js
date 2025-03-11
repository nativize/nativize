//export stuffs

//TODO:
// [ ] command line arguments
//   | commands:
//   |   help
//   |   version
//   |   init? new?
//   |   check
//   |   prepare
//   |   build
//   |   run
//   |   clean
//   | options:
//   |   --backend: specifies backend implementation
//   |   --backend-path: specifies backend implementation path (ignores --backend)
//   |   --platform: specifies target platform
//   |   --config: specifies configuration file path
// [ ] configuration
//   | configuration file should be either in json(c)/js/ts format
// [ ] we need to add a way to handle target platform
//   | target platform can be passed to backend build process
//   | which means, each backend's `target` should filter supported platforms
//   | for example, webview2 backend should only support windows
//   | and qtwebengine should only support macos, linux, windows
//   | and webview should only support android
// [ ] implement `webkit2` backend
//     [ ] buy a mac
//     [ ] go ahead
// [ ] each backend's command error handling
//   | when command fails, it should throw an error, so that we can catch it,
//   | then prevent running program even without build completed

if (import.meta.main) {
  const commandModule = await import("./src/command.js");
  const { parseArguments } = commandModule;
  const { commands, options } = parseArguments(Deno.args);

  // handle commands
  // if command is not provided, show help
  if (commands.length === 0) {
    const { help } = commandModule;
    help();
  } // if command is provided, run the command
  else {
    // if command is related to project (check, prepare, build, run, clean... etc... ), we need to load configuration then
    // `new` does not tho.
    const command = commands[0];
    if (command in commandModule) {
      await commandModule[command](options);
    } else {
      console.error(`Unknown command: ${command}`);
    }
  }

  // configuration here?
  // load configuration
  // if configuration path is not provided, use default configuration path
  //   order:
  //     1. ./nativize.config.json
  //       a. ./nativize.json
  //       b. ./nativize.config.{android|ios|macos|linux|windows}.json
  //     2. ./nativize.config.js
  // if configuration file is json/jsonc, whatever those are, parse it
  // if configuration file is js/ts, import it, then get default export
  //   this js/ts file should return configuration object

  // let backendPath = options["--backend-path"];
  //
  // if (!backendPath) {
  //   const { defaultBackend } = await import("./src/platform.js");
  //   const { existsSync } = await import("@std/fs");

  //   const backend = options["--backend"] ?? defaultBackend[Deno.build.os];

  //   backendPath = `${Deno.cwd()}/.nativize/${backend}`;

  //   if (!existsSync("./.nativize/")) {
  //     await Deno.mkdir("./.nativize/");
  //   }

  //   if (!existsSync(backendPath)) {
  //     try {
  //       await new Deno.Command("git", {
  //         args: [
  //           "clone",
  //           `https://github.com/nativize/nativize-${backend}`,
  //           backendPath,
  //         ],
  //       }).spawn().status;
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // }

  // const { prepare, build, run, clean } = await import(
  //   `file://${backendPath}/nativize.js`
  // );

  // try {
  //   await clean();
  //   await prepare();
  //   await build({
  //     identifier: "com.nativize.abcde",
  //     url: "https://naver.com",
  //   });
  //   await run({
  //     identifier: "com.nativize.abcde",
  //     avd: "Medium_Phone_API_35", //android specific
  //   });
  // } catch (error) {
  //   console.error(error);
  // } finally {
  //   console.log("well... finally?");
  // }
}
