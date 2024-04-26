const core = require('@actions/core')
const fs = require('fs')
const path = require('path')

const ArchiveUtil = require('../util/ArchiveUtil')
const UnZipArchive = require('../commands/zip/UnZipArchive')
const { error } = require('console')

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
        const rootDist = path.join(process.env.GITHUB_WORKSPACE, 'dist')
		this.archiveFile = path.join(rootDist, this.archiveName)
		this.unzippedFolder = path.join(rootDist, 'unzipped')
	}

	cleanVersion (str) {
		const index = str.indexOf('(')
		return index > -1 ? str.substring(0, index).trim() : str
	}

	async unzipArchive () {
        const unzip = new UnZipArchive();
        return await unzip.execute();
	}

    async copyLocalToS3 () {
		console.log('copy files: local to S3')
	}

    validateAction()
    {
        let errored = false;
        const zipAvailable = fs.existsSync(this.archiveFile)
        if (!zipAvailable) {
            core.setFailed('Archive file is not available', this.archiveFile)
            errored = true
        }

        return errored
    }
    
	async execute () {
        if (!this.validateAction())
        {
            console.error('cancelling action, something went wrong')
            return;
        }        

        const unzipped = await this.unzipArchive();
        await this.copyLocalToS3();
	}
}

module.exports = RollbackArchive
