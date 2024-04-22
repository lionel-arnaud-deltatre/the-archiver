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
      console.log("getFolderFiles", data.Contents)
      return this.extractRecentFiles(data.Contents);
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
      return true;
    } catch (uploadErr) {
      console.error("Upload failed:", uploadErr);
      return false;
    }
  }

  extractRecentFiles(dataArray) {
    const extractVersion = (filename) => {
        const start = filename.lastIndexOf('_') + 1;
        const end = filename.lastIndexOf('.zip');
        return filename.substring(start, end);
      };

    let transformedData = dataArray
      .map((item) => ({
        version: extractVersion(item.Key.split("/").pop()),
        lastModified: item.LastModified,
        size: item.Size,
      }))
      .sort((a, b) => new Date(a.LastModified).getTime() - new Date(b.LastModified).getTime());

      console.log("????", transformedData)
    return transformedData.slice(0, 5);
  }
}

module.exports = S3Connector;
