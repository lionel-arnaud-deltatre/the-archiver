const fs = require("fs");
const path = require("path");

const ArchiveUtil = require("../util/ArchiveUtil");

class FetchArchive {
  constructor(params) {
    this.params = params;

    this.archiveName = ArchiveUtil.getArchiveName(
      params.appName,
      params.deviceType,
      params.environment,
      params.version
    );

    this.tempLocalFile = path.join(process.env.GITHUB_WORKSPACE, 'temp', this.archiveName);
  }

  async downloadArchive() {
    const s3conn = new S3Connector();
	const s3FolderPath = s3conn.getS3Path(this.params.appName, this.params.deviceType, this.params.environment);
   
    const success = await s3conn.downloadZipFile(
        s3FolderPath + '/' + this.archiveName,
        this.tempLocalFile
    );

    // check zip exists
    console.log("check zip here", this.tempLocalFile, fs.existsSync(this.tempLocalFile))

    return success;
  }

  async execute() {
    console.log("execute fetch archive from S3");
    console.log("save it to", this.outputFilename);
  }
}

module.exports = FetchArchive;
