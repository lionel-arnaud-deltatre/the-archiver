const spawn = require("child_process").spawn;

class ExecCommand {
  constructor(ignore = false) {
    this.ignoreError = ignore;
  }

  execute(args) {
    const exe = args.shift();
    console.log("executing:", exe, args);

    return new Promise((resolve) => {
      const process = spawn(exe, args);
      const buffer = [];

      process.stdout.on("data", (data) => {
        //console.log("stdout: " + data.toString());
        buffer.push(data.toString())
      });

      if (!this.ignoreError) {
        process.stderr.on("data", (data) => {
          //console.log("stderr: " + data.toString());
          resolve({ error: 1, errorMsg: data.toString() });
        });
      }

      process.on("exit", (code) => {
        //console.log("child process exited with code " + code.toString());
        resolve({ error: 0, data: buffer });
      });
    });
  }
}

module.exports = ExecCommand;
