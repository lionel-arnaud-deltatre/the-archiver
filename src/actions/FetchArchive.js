const ArchiveUtil = require("../util/ArchiveUtil");

class FetchArchive {
  constructor(params) {
    this.params = params;

    const filename = ArchiveUtil.getArchiveName(
      params.appName,
      params.deviceType,
      params.environment,
      params.version
    );

    this.outputFilename = path.join(process.env.GITHUB_WORKSPACE, 'temp', filename);
  }

  async execute() {
    console.log("execute fetch archive from S3");
    console.log("save it to", this.outputFilename);
  }
}

module.exports = FetchArchive;
