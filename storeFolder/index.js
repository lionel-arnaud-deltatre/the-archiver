const core = require('@actions/core');
const AWS = require('aws-sdk');
const fs = require('fs');
const archiver = require('archiver');

async function run() {
  try {
    const appName = core.getInput('appName');
    const folderPath = core.getInput('folderPath');
    const deviceType = core.getInput('deviceType');
    const version = core.getInput('version');

    const outputFilename = `${appName}_${deviceType}_${version}.zip`;

    const validFolder = fs.existsSync(folderPath);

    console.log(`Upload check`);
    console.log(`- appName: ${appName}`);
    console.log(`- folderPath: ${folderPath} (valid: ${validFolder})`);
    console.log(`- deviceType: ${deviceType}`);
    console.log(`- version: ${version}`);
    console.log(`- outputFilename: ${outputFilename}`);


    return;

    // Setup S3
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: awsRegion
    });

    // Zip the directory
    const output = fs.createWriteStream(outputFilename);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', async function() {
      console.log(`Archive created: ${outputFilename} (${archive.pointer()} total bytes)`);

      // Upload to S3
      const s3Params = {
        Bucket: s3Bucket,
        Key: outputFilename,
        Body: fs.createReadStream(outputFilename)
      };

      const data = await s3.upload(s3Params).promise();
      console.log(`File uploaded successfully at ${data.Location}`);
    });

    archive.on('error', function(err) {
      throw err;
    });

    archive.pipe(output);
    archive.directory(folderPath, false);
    archive.finalize();
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
