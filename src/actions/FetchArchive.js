const core = require("@actions/core");
const fs = require("fs");
const path = require("path");

const ArchiveUtil = require("../util/ArchiveUtil");
const S3Connector = require("../actors/S3Connector");

class FetchArchive {
  constructor(params) {
    this.params = params;

    this.archiveName = ArchiveUtil.getArchiveName(
      params.appName,
      params.deviceType,
      params.environment,
      params.version
    );

    const tempFolder = path.join(process.env.GITHUB_WORKSPACE, 'temp');

    if (!fs.existsSync(tempFolder))
        fs.mkdirSync(tempFolder, { recursive: true });

    this.tempLocalFile = path.join(tempFolder, this.archiveName);
  }

  async downloadArchive() {
    const s3conn = new S3Connector();
	const s3FolderPath = s3conn.getS3Path(this.params.appName, this.params.deviceType, this.params.environment);
   
    const success = await s3conn.downloadZip(
        s3FolderPath + this.archiveName,
        this.tempLocalFile
    );

    return success;
  }

  async execute() {
    console.log("execute fetch archive from S3");
    console.log("save it to", this.tempLocalFile);

    const success = await this.downloadArchive();

    // check zip exists
    const zipAvailable = fs.existsSync(this.tempLocalFile);

    if (!success || !zipAvailable) {
        core.setOutput("errorMessage", "could not fetch archive");
    } else {
        core.setOutput("archiveName", this.archiveName);
    }
  }
}

module.exports = FetchArchive;
