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
  const { parseArguments } = await import("./src/command.js");
  const { commands, options } = parseArguments(Deno.args);

  let backendPath = options["--backend-path"];

  if (!backendPath) {
    const { defaultBackend } = await import("./src/platform.js");
    const { existsSync } = await import("@std/fs");

    const backend = options["--backend"] ?? defaultBackend[Deno.build.os];

    backendPath = `${Deno.cwd()}/.nativize/${backend}`;

    if (!existsSync("./.nativize/")) {
      await Deno.mkdir("./.nativize/");
    }

    if (!existsSync(backendPath)) {
      try {
        await new Deno.Command("git", {
          args: [
            "clone",
            `https://github.com/nativize/nativize-${backend}`,
            backendPath,
          ],
        }).spawn().status;
      } catch (error) {
        console.error(error);
      }
    }
  }

  const { prepare, build, run, clean } = await import(
    `file://${backendPath}/nativize.js`
  );

  try {
    await clean();
    await prepare();
    await build({
      identifier: "com.nativize.abcde",
      url: "https://naver.com",
    });
    await run({
      identifier: "com.nativize.abcde",
      avd: "Medium_Phone_API_35", //android specific
    });
  } catch (error) {
    console.error(error);
  } finally {
    console.log("well... finally?");
  }
}
