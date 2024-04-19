const core = require("@actions/core");

const fs = require("fs");
const path = require("path");

const ArchiveManager = require("../actors/ArchiveManager");
const S3Connector = require("../actors/S3Connector");

class StoreFolder {
  constructor(params) {
    this.params = params;

    const filename = `${params.appName}_${params.deviceType}_${params.version}.zip`;
    this.outputFilename = path.join(__dirname, filename);

    this.s3FolderPath = `archiver/${params.appName}/${params.deviceType}/`;
  }

  validParameters() {
    if (!fs.existsSync(this.params.folderPath)) {
      core.setOutput("errorMessage", "source folder is invalid");
      return false;
    }
    return true;
  }

  async zipFolder() {
    const archman = new ArchiveManager();
    await archman.zipFolder(this.params.folderPath, this.outputFilename);
  }

  async uploadZipFile() {
    const s3conn = new S3Connector();
    const result = await s3conn.uploadFile(this.s3FolderPath, this.outputFilename);

    if (result)
    {
      core.setOutput("remoteFolderContent", JSON.stringify(result));      
    }
  }  

  async execute() {
    console.log("execute action store");

    if (!this.validParameters()) {
      core.setFailed("Action failed due to an error.");
      return;
    }

    await this.zipFolder();
    await this.uploadZipFile();
  }
}

module.exports = StoreFolder;
