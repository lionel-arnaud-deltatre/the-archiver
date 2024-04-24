const fs = require("fs");
const path = require("path");

const ExecCommand = require("../../util/ExecCommand");

class ZipFolder {
  constructor() {}

  async execute(sourceDir, outputFile) {
    if (!fs.existsSync(sourceDir)) {
        console.error("ERROR zipping: folder does not exist", sourceDir);
        return false;
    }

    const zipScript = path.join(__dirname, "../../../resource/zip_folder.sh");
    
    const cmd = new ExecCommand();
    const cmdline = [zipScript, outputFile, sourceDir];
    const res = await cmd.execute(cmdline);
    return res.error === 0;
  }
}

module.exports = ZipFolder;
