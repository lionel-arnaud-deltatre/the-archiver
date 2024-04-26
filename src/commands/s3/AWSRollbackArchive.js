const fs = require('fs')
const path = require('path')
const ExecCommand = require('../../util/ExecCommand')
const AWSDefaultCommand = require('./AWSDefaultCommand')

class AWSRollbackArchive extends AWSDefaultCommand {
	constructor () {
		super('rollback')
	}

	async execute (buildPath) {
		const s3rollbackScript = path.join(__dirname, '../../../resource/aws_s3_rollback.sh')
		
		console.log('execute s3 rollback', buildPath)
        fs.readdirSync(buildPath).forEach(file => {
            console.log(` - ${file}`);
          });

        return true

		const cmd = new ExecCommand(true)
		const cmdline = [
			s3uploadScript,
			this.AWSkeyID,
			this.AWSSecret,

			zipPath,
			this.bucketName,
			s3Path,
			this.bucketRegion
		]
		const res = await cmd.execute(cmdline)
		return res.error === 0
	}
}

module.exports = AWSRollbackArchive
