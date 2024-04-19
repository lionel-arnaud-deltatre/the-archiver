const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");

class S3Connector {
  constructor() {
    const s3Config = {
      accessKeyId: process.env.ARCHIVER_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.ARCHIVER_AWS_SECRET_ACCESS_KEY,
      region: "eu-west-1",
    };

    this.s3 = new AWS.S3(s3Config);
  }

  async uploadFile(remotePath, filename) {
    const bodyStream = fs.createReadStream(filename);
    const s3Params = {
      Bucket: "tv-apps-global",
      Key: remotePath + path.basename(filename),
      Body: bodyStream,
    };

    try {
      const data = await this.s3.upload(s3Params).promise();
      console.log(`File uploaded successfully at ${data.Location}`);
    } catch (uploadErr) {
      console.error("Upload failed:", uploadErr);
    }
  }
}

module.exports = S3Connector;
