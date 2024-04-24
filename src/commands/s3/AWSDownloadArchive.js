const path = require('path')
const ExecCommand = require('../../util/ExecCommand')
const AWSDefaultCommand = require('./AWSDefaultCommand')

class AWSDownloadArchive extends AWSDefaultCommand {
	constructor () {
		super('download')
	}

	async execute (appName, device, env, archiveName, zipPath) {
		const s3dlScript = path.join(__dirname, '../../../resource/aws_s3_download.sh')
		const s3Path = this.getS3ArchivePath(appName, device, env) + archiveName

		console.log('execute s3 download', s3Path, 'to', zipPath)

		const cmd = new ExecCommand(true)
		const cmdline = [
			s3dlScript,
			process.env.ARCHIVER_AWS_ACCESS_KEY_ID,
			process.env.ARCHIVER_AWS_SECRET_ACCESS_KEY,

			this.bucketName,
			s3Path,
			zipPath,
			this.bucketRegion
		]
		const res = await cmd.execute(cmdline)
		return res.error === 0
	}
}

module.exports = AWSDownloadArchive
