const core = require("@actions/core");
const fs = require("fs");
const path = require("path");

const ArchiveManager = require("../actors/ArchiveManager");
const S3Connector = require("../actors/S3Connector");
const UpdateRBWorkflow = require("./common/UpdateRollbackWorkflow");
const CommitChanges = require("./common/CommitChanges");
const ArchiveUtil = require("../util/ArchiveUtil");

class StoreFolder {
  constructor(params) {
    this.params = params;

    const filename = ArchiveUtil.getArchiveName(params.appName, params.deviceType, params.environment, params.version);
    this.outputFilename = path.join(__dirname, filename);
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
      await archman.zipFolderSH(this.params.folderPath, this.outputFilename);
      return true;
    } else {
      console.error("ERROR: folder does not exists, skipping zipping")
      return false;
    }
  }

  async uploadZipFile(zipped) {
    const s3conn = new S3Connector();
	const s3FolderPath = s3conn.getS3Path(this.params.appName, this.params.deviceType, this.params.environment);

    if (zipped)
    {
      const success = await s3conn.uploadFile(
        s3FolderPath,
        this.outputFilename
      );
    }
    
    // get updated files from bucket
    const updatedFiles = await s3conn.getFolderFiles(s3FolderPath);
    return updatedFiles;
  }

  async updateRollback(versions) {
    const updater = new UpdateRBWorkflow();
    return await updater.update(this.params, versions)
  }

  async commitChanges() {
    const changes = new CommitChanges();
    return await changes.commit();
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
      await this.commitChanges();
      console.log("changes commited, all good")
    }
  }
}

module.exports = StoreFolder;
