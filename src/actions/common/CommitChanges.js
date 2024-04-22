const path = require("path");
const ExecCommand = require("../../util/ExecCommand");

class CommitChanges {
  constructor() {}

  async commit() {

    const commitScript = path.join(__dirname, "../../../resource/commit.sh");
    
    const cmd = new ExecCommand(true);
    const cmdline = [commitScript, process.env.GITHUB_WORKSPACE];
    const res = await cmd.execute(cmdline);
  }
}

module.exports = CommitChanges
