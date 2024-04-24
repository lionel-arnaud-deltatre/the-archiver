const fs = require("fs");
const path = require("path");

const archiver = require("archiver");
const ExecCommand = require("../util/ExecCommand");

class ArchiveManager {
  constructor() {}

  async zipFolderSH(sourceDir, outputFile) {
    const zipScript = path.join(__dirname, "../../resource/zip_folder.sh");
    
    const cmd = new ExecCommand();
    const cmdline = [zipScript, outputFile, sourceDir];
    const res = await cmd.execute(cmdline);
    console.log("zipFolderSH res", res);
  }

  zipFolder(sourceDir, outputFile) {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(outputFile);
      const archive = archiver("zip", { zlib: { level: 9 } }); // Sets the compression level.

      output.on("close", () => {
        console.log(`Archived ${archive.pointer()} total bytes`);
        resolve();
      });

      output.on("end", () => {
        console.log("Data has been drained");
      });

      archive.on("warning", (err) => {
        if (err.code === "ENOENT") {
          console.warn(err);
        } else {
          reject(err);
        }
      });

      archive.on("error", (err) => {
        reject(err);
      });

      archive.pipe(output);
      archive.directory(sourceDir, false);
      archive.finalize();
    });
  }
}

module.exports = ArchiveManager;
