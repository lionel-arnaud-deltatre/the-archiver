const core = require("@actions/core");

const fs = require("fs");
const path = require("path");

const ArchiveManager = require("../actors/ArchiveManager");
const S3Connector = require("../actors/S3Connector");
const UpdateRBWorkflow = require("./common/UpdateRollbackWorkflow");

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
    if (fs.existsSync(this.params.folderPath))
    {
      await archman.zipFolder(this.params.folderPath, this.outputFilename);
      return true;
    } else {
      console.error("ERROR: folder does not exists, skipping zipping")
      return false;
    }
  }

  async uploadZipFile(zipped) {
    const s3conn = new S3Connector();
    if (zipped)
    {
      const success = await s3conn.uploadFile(
        this.s3FolderPath,
        this.outputFilename
      );
    }
    
    // get updated files from bucket
    const updatedFiles = await s3conn.getFolderFiles(this.s3FolderPath);

    //if (updatedFiles) {
    //  core.setOutput("remoteFolderContent", JSON.stringify(updatedFiles));
    //}
    return updatedFiles;
  }

  async updateRollback(versions) {
    const updater = new UpdateRBWorkflow();
    return await updater.update(this.params.deviceType, versions)
  }

  async execute() {
    console.log("execute action store");

    if (!this.validParameters()) {
      core.setFailed("Action failed due to an error.");
      return;
    }

    const zipped = await this.zipFolder();
    const updatedVersions = await this.uploadZipFile(zipped);

    // add/update rollback for target
    const rbFileUpdated = await this.updateRollback(updatedVersions);
    if (rbFileUpdated)
    {
      console.log("all good, lets commit");
    }
    else {
      console.error("rollback error");
    }

    return true;
  }
}

module.exports = StoreFolder;
