//export stuffs

if (import.meta.main) {
  //const { parseArguments } = await import("./src/command.js");

  // TODO: finish this one
  // 1. Parse everything. to substring, arguments, etc.
  // console.log(parse(Deno.args));
  // 2. then execute command

  // PROTOTYPE CODE
  const { defaultBackend } = await import("./src/platform.js");
  const { existsSync } = await import("@std/fs");

  const platform = "windows";
  const backend = defaultBackend[platform];

  if (!existsSync("./.nativize/")) {
    await Deno.mkdir("./.nativize/");
  }

  if (!existsSync(`./.nativize/${backend}`)) {
    console.log("Cloning backend...");
    try {
      const process = new Deno.Command("git", {
        args: [
          "clone",
          `https://github.com/nativize/nativize-${backend}`,
          `./.nativize/${backend}`,
        ],
        stdout: "piped",
        stderr: "piped",
      }).spawn();

      process.stdout.pipeTo(Deno.stdout.writable, { preventClose: true });
      process.stderr.pipeTo(Deno.stderr.writable, { preventClose: true });

      await process.status;
    } catch (error) {
      console.error(error);
    }
  }

  const { prepare, build, run, clean } = await import(
    `file:${Deno.cwd()}/.nativize/${backend}/nativize.js`
  );

  //await clean();
  await prepare();
  await build({ identifier: "com.example.myapplication" });
  await run({
    identifier: "com.example.myapplication",
    avd: "Medium_Phone_API_35",
  });
}
