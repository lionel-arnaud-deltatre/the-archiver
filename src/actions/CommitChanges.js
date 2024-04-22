const ExecCommand = require("../util/ExecCommand");

class CommitChanges {
  constructor() {}

  async commit() {
    const cmdline = ["osascript", "-e", 'quit app "electron"'];

    const cmd = new ExecCommand();
    const res = await cmd.execute(cmdline);

    console.log("res ", res);
  }
}

module.exports = CommitChanges