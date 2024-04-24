const core = require("@actions/core");
const fs = require("fs");
const path = require("path");

const ArchiveUtil = require("../util/ArchiveUtil");
const FileUtil = require("../util/FileUtil");
const AWSDownloadArchive = require("../commands/s3/AWSDownloadArchive");

class FetchArchive {
  constructor(params) {
    this.params = params;

    this.archiveName = ArchiveUtil.getArchiveName(
      params.appName,
      params.deviceType,
      params.environment,
      params.version
    );

    const tempFolder = path.join(process.env.GITHUB_WORKSPACE, 'dist');

    FileUtil.ensureDirSync(tempFolder);

    this.tempLocalFile = path.join(tempFolder, this.archiveName);
  }

  async downloadArchive() {
    console.log("download archive")

    const dlCmd = new AWSDownloadArchive();
    return await dlCmd.execute(
        this.params.appName,
        this.params.deviceType,
        this.params.environment,
        this.tempLocalFile
    );
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
