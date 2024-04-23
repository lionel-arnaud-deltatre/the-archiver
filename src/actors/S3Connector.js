const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");

const config = require("../../config.json");

class S3Connector {
  constructor() {
    this.bucketName = process.env.ARCHIVER_BUCKET_NAME;
    this.rootFolder = process.env.ARCHIVER_ROOT_FOLDER || config.AWS.rootFolder;

    const bucketRegion = process.env.ARCHIVER_S3_REGION || config.AWS.awsRegion;

    const s3Config = {
      accessKeyId: process.env.ARCHIVER_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.ARCHIVER_AWS_SECRET_ACCESS_KEY,
      region: bucketRegion,
    };

    this.s3 = new AWS.S3(s3Config);
  }

  getS3Path(appName, device, env) {
    return `${this.rootFolder}/${appName}/${device}/${env}/`;
  }

  async getFolderFiles(remotePath) {
    const listParams = {
      Bucket: this.bucketName,
      Prefix: remotePath, // Using Prefix to filter objects within a specific folder
    };

    try {
      const data = await this.s3.listObjectsV2(listParams).promise();
      return this.extractRecentFiles(data.Contents);
    } catch (error) {
      console.error("Error in listing S3 Objects:", error);
      return null;
    }
  }

  async downloadZip(pathToZip, localFilePath) {
    const params = {
      Bucket: this.bucketName,
      Key: pathToZip
    };

    try {
      const data = await this.s3.getObject(params).promise();
      fs.writeFileSync(localFilePath, data.Body);

      console.log(`Zip file downloaded and saved locally at ${localFilePath}`);
      return true;
    } catch (error) {
      console.error('Error downloading zip file:', params, error);
      return false;
    }
  }

  async uploadFile(remotePath, filename) {
    const bodyStream = fs.createReadStream(filename);
    const s3Params = {
      Bucket: config.AWS.bucketName,
      Key: remotePath + path.basename(filename),
      Body: bodyStream,
    };

    try {
      const data = await this.s3.upload(s3Params).promise();
      console.log(`File uploaded successfully at ${data.Location}`);
      return true;
    } catch (uploadErr) {
      console.error("Upload failed:", uploadErr);
      return false;
    }
  }

  extractRecentFiles(dataArray) {
    const extractVersion = (filename) => {
      const start = filename.lastIndexOf("_") + 1;
      const end = filename.lastIndexOf(".zip");
      return filename.substring(start, end);
    };

    const transformedData = dataArray
      .map((item) => ({
        version: extractVersion(item.Key.split("/").pop()),
        lastModified: item.LastModified,
        ts: new Date(item.LastModified).getTime(),
        size: item.Size,
      }))
      .sort((a, b) => b.ts - a.ts);

    return transformedData.slice(0, 5);
  }
}

module.exports = S3Connector;
