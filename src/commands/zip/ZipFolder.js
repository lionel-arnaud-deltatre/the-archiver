const path = require("path");

const ExecCommand = require("../../util/ExecCommand");

class ZipFolder {
  constructor() {}

  async execute(sourceDir, outputFile) {
    const zipScript = path.join(__dirname, "../../../resource/zip_folder.sh");
    
    const cmd = new ExecCommand();
    const cmdline = [zipScript, outputFile, sourceDir];
    const res = await cmd.execute(cmdline);
    console.log("zipFolder res", res);
  }
}

module.exports = ZipFolder;
