const fs = require("fs");
const archiver = require("archiver");

class ArchiveManager {
  constructor() {}

  zipFolder(sourceDir, outPath) {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(outPath);
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
