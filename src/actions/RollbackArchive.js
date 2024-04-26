const core = require('@actions/core')
const fs = require('fs')
const path = require('path')

const ArchiveUtil = require('../util/ArchiveUtil')
const UnZipArchive = require('../commands/zip/UnZipArchive')
const { error } = require('console')
const AWSRollbackArchive = require('../commands/s3/AWSRollbackArchive')

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
        return await unzip.execute(this.archiveFile, this.unzippedFolder);
	}

    async copyLocalToS3 () {
        const rbCmd = new AWSRollbackArchive()
		return await rbCmd.execute( this.unzippedFolder );
	}

    invalidAction()
    {
        let invalid = false;
        const zipAvailable = fs.existsSync(this.archiveFile)
        if (!zipAvailable) {
            core.setFailed('Archive file is not available', this.archiveFile)
            invalid = true
        }

        return invalid
    }
    
	async execute () {
        if (this.invalidAction())
        {
            console.error('cancelling action, something went wrong')
            return;
        }        

        console.log('executing rollback')
        const unzipped = await this.unzipArchive();
        console.log(' - unzipped ? ', unzipped)
        const replaced = await this.copyLocalToS3();
        console.log(' - s3 replaced ? ', replaced)
	}
}

module.exports = RollbackArchive
