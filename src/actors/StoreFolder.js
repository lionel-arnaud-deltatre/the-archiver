const AWS = require("aws-sdk");
const fs = require("fs");
const archiver = require("archiver");

class StoreFolder {
  constructor(params) {
    this.params = params;

    this.outputFilename = `${params.appName}_${params.deviceType}_${params.version}.zip`;
  }

  execute() {
    console.log("execute action store");

    const validFolder = fs.existsSync(params.folderPath);

    console.log("params", this.params);
    console.log(`- outputFilename: ${outputFilename}`);
    console.log(`- validFolder: ${outputFvalidFolderilename}`);

    return;
    try {
      // Setup S3
      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: awsRegion,
      });

      // Zip the directory
      const output = fs.createWriteStream(outputFilename);
      const archive = archiver("zip", { zlib: { level: 9 } });

      output.on("close", async function () {
        console.log(
          `Archive created: ${outputFilename} (${archive.pointer()} total bytes)`
        );

        // Upload to S3
        const s3Params = {
          Bucket: s3Bucket,
          Key: outputFilename,
          Body: fs.createReadStream(outputFilename),
        };

        const data = await s3.upload(s3Params).promise();
        console.log(`File uploaded successfully at ${data.Location}`);
      });

      archive.on("error", function (err) {
        throw err;
      });

      archive.pipe(output);
      archive.directory(folderPath, false);
      archive.finalize();
    } catch (err) {
      console.log("error", err);
    }
  }
}

module.exports = StoreFolder;
