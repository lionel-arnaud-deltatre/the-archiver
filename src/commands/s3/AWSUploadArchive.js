
const path = require("path");
const ExecCommand = require("../../util/ExecCommand");
const AWSDefaultCommand = require("./AWSDefaultCommand");

class AWSUploadArchive extends AWSDefaultCommand {
  constructor() {
    super()
  }

  async execute(appName, device, env, zipPath) {

    const s3uploadScript = path.join(__dirname, "../../../resource/aws_s3_upload.sh");
    const s3Path = this.getS3ArchivePath(appName, device, env);

    console.log("execute s3 upload", zipPath, "to", s3Path);

    const cmd = new ExecCommand(true);
    const cmdline = [
        s3uploadScript, 
        process.env.ARCHIVER_AWS_ACCESS_KEY_ID,
        process.env.ARCHIVER_AWS_SECRET_ACCESS_KEY,

        zipPath,
        this.bucketName,
        s3Path,
        this.bucketRegion
    ];
    const res = await cmd.execute(cmdline);
    return res.error === 0;    
  }
}

module.exports = AWSUploadArchive
