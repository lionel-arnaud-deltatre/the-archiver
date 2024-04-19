const core = require("@actions/core");
const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

class StoreFolder {
  constructor(params) {
    this.params = params;

    this.outputFilename = `${params.appName}_${params.deviceType}_${params.version}.zip`;
    this.s3FolderPath = `archiver/${params.appName}/${params.deviceType}/`;
  }

  execute() {
    console.log("execute action store");

    const validFolder = fs.existsSync(this.params.folderPath);
    if (!validFolder)
    {
        core.setOutput("errorMessage", "source folder is invalid");
        core.setFailed("Action failed due to an error.");
    }

    try {
      const s3Config = {
        accessKeyId: process.env.ARCHIVER_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.ARCHIVER_AWS_SECRET_ACCESS_KEY,
        region: "eu-west-1",
      };

      // Setup S3
      const s3 = new AWS.S3( s3Config );
    
      // Define paths
      const outputFilename = path.join(__dirname, this.outputFilename);

      console.log("s3Config", s3Config);
      console.log("this.s3FolderPath", this.s3FolderPath);
      console.log("path.basename(outputFilename)", path.basename(outputFilename));

      // Create a file to stream archive data to.
      const output = fs.createWriteStream(outputFilename);
      const archive = archiver("zip", {
        zlib: { level: 9 }, // Sets the compression level.
      });

      // Listen for all archive data to be written
      output.on("close", async () => {
        console.log(
          `Archive created: ${outputFilename} (${archive.pointer()} total bytes)`
        );

        // Upload to S3
        const bodyStream = fs.createReadStream(outputFilename);
        const s3Params = {
          Bucket: "tv-apps-global",
          Key: this.s3FolderPath + path.basename(outputFilename),
          Body: bodyStream,
        };

        try {
          const data = await s3.upload(s3Params).promise();
          console.log(`File uploaded successfully at ${data.Location}`);
        } catch (uploadErr) {
          console.error("Upload failed:", uploadErr);
        }
      });

      // Good practice to catch this error explicitly
      archive.on("error", (err) => {
        console.error("Archiving error:", err);
      });

      // Pipe archive data to the file
      archive.pipe(output);

      // Append files from a sub-directory and naming it `new-subdir` within the archive
      archive.directory(this.params.folderPath, false);

      // Finalize the archive (i.e., finish appending files and finalize the archive)
      archive.finalize();
    } catch (err) {
      console.error("An error occurred:", err);
    }
  }
}

module.exports = StoreFolder;
