const path = require('path')
const ExecCommand = require('../../util/ExecCommand')
const AWSDefaultCommand = require('./AWSDefaultCommand')

class AWSGetVersions extends AWSDefaultCommand {
	constructor () {
		super('getversions')
	}

	async execute (appName, device, env) {
		const s3versionsScript = path.join(__dirname, '../../../resource/aws_s3_list.sh')
		const s3Path = this.getS3ArchivePath(appName, device, env)

		console.log('execute s3 get files in folder', s3Path)

		const cmd = new ExecCommand(true)
		const cmdline = [
			s3versionsScript,
			this.AWSkeyID,
			this.AWSSecret,

			this.bucketName,
			s3Path,
			this.bucketRegion
		]
		const res = await cmd.execute(cmdline)

		if (res.error === 0) {
			const data = JSON.parse(res.data)
			return this.extractRecentFiles(data.Contents)
		}

		return []
	}

	extractRecentFiles (dataArray) {
		const extractVersion = (filename) => {
			const start = filename.lastIndexOf('_') + 1
			const end = filename.lastIndexOf('.zip')
			return filename.substring(start, end)
		}

		const transformedData = dataArray
			.map((item) => ({
				version: extractVersion(item.Key.split('/').pop()),
				lastModified: item.LastModified,
				ts: new Date(item.LastModified).getTime(),
				size: item.Size
			}))
			.sort((a, b) => b.ts - a.ts)

		return transformedData.slice(0, 5)
	}
}

module.exports = AWSGetVersions
