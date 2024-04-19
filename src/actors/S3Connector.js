const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");

class S3Connector {
  constructor() {
    this.bucketName = "tv-apps-global";

    const s3Config = {
      accessKeyId: process.env.ARCHIVER_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.ARCHIVER_AWS_SECRET_ACCESS_KEY,
      region: "eu-west-1",
    };

    this.s3 = new AWS.S3(s3Config);
  }

  async getFolderFiles(remotePath) {
    const listParams = {
      Bucket: this.bucketName,
      Prefix: remotePath, // Using Prefix to filter objects within a specific folder
    };

    try {
        const data = await this.s3.listObjectsV2(listParams).promise();
        console.log("S3 Objects:", data.Contents);
        return data.Contents;  // Contains an array of objects within the specified bucket and prefix
    } catch (error) {
        console.error("Error in listing S3 Objects:", error);
        return null;
    }
  }
  async uploadFile(remotePath, filename) {
    const bodyStream = fs.createReadStream(filename);
    const s3Params = {
      Bucket: this.bucketName,
      Key: remotePath + path.basename(filename),
      Body: bodyStream,
    };

    try {
      const data = await this.s3.upload(s3Params).promise();
      console.log(`File uploaded successfully at ${data.Location}`);

      const newfiles = await this.getFolderFiles(remotePath);
      console.log(`got new files ??`, newfiles);
      return newfiles;
    } catch (uploadErr) {
      console.error("Upload failed:", uploadErr);
      return null;
    }
  }
}

module.exports = S3Connector;
