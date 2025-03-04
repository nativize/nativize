//export stuffs

if (import.meta.main) {
  const { parseArguments } = await import("./src/command.js");
  const { commands, options } = parseArguments(Deno.args);

  let backendPath = options["--backend-path"];

  if (!backendPath) {
    const { defaultBackend } = await import("./src/platform.js");
    const { existsSync } = await import("@std/fs");

    const backend = options["--backend"] ?? defaultBackend[Deno.build.os];

    backendPath = `./.nativize/${backend}`;

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
    `${backendPath}/nativize.js`
  );

  try {
    await clean();
    await prepare();
    await build({ identifier: "com.nativize.test" });
    await run({
      identifier: "com.nativize.test",
      avd: "Medium_Phone_API_35",
    });
  } catch (error) {
    console.error(error);
  }
}
