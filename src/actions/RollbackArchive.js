const core = require('@actions/core')
const fs = require('fs')
const path = require('path')

const ArchiveUtil = require('../util/ArchiveUtil')

class RollbackArchive {
	constructor (params) {
		this.params = params

		// clean version as dropdown version looks like "2.9.1 (April 24, 2024 01:45 PM - 631.71kb)"
		this.params.version = this.cleanVersion(this.params.version)

		this.archiveName = ArchiveUtil.getArchiveName(
			params.appName,
			params.deviceType,
			params.environment,
			params.version
		)

        // WARNING: you need to call this action after FetchArchive
		this.archiveFile = path.join(process.env.GITHUB_WORKSPACE, 'dist', this.archiveName)

        const zipAvailable = fs.existsSync(this.archiveFile)
        console.log('RollbackArchive check archive available locally:', this.archiveFile, zipAvailable);
	}

	cleanVersion (str) {
		const index = str.indexOf('(')
		return index > -1 ? str.substring(0, index).trim() : str
	}

	async unzipArchive () {
		console.log('unzip archive')
	}

    async copyLocalToS3 () {
		console.log('copy files: local to S3')
	}


	async execute () {
		console.log('execute rollback archive to S3')
		console.log('zipped build: ', this.archiveFile)

        await this.unzipArchive();
        await this.copyLocalToS3();
	}
}

module.exports = RollbackArchive
