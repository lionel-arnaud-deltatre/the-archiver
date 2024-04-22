const spawn = require("child_process").spawn;

class ExecCommand {
  constructor() {}

  execute(args) {
    const exe = args.shift();
    console.log("executing:", exe, args);

    return new Promise((resolve) => {
      const process = spawn(exe, args);

      process.stdout.on("data", function (data) {
        console.log("stdout: " + data.toString());
      });

      process.stderr.on("data", function (data) {
        console.log("stderr: " + data.toString());
        resolve({ error: 1, errorMsg: data.toString() });
      });

      process.on("exit", function (code) {
        console.log("child process exited with code " + code.toString());
        resolve({ error: 0 });
      });
    });
  }
}

module.exports = ExecCommand;
