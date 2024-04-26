const core = require('@actions/core')
const fs = require('fs')
const path = require('path')

const ArchiveUtil = require('../util/ArchiveUtil')

const ZipFolder = require('../commands/zip/ZipFolder')
const UpdateWorkflow = require('../commands/workflows/UpdateWorkflow')
const CommitChanges = require('../commands/git/CommitChanges')
const AWSUploadArchive = require('../commands/s3/AWSUploadArchive')
const FileUtil = require('../util/FileUtil')
const AWSGetVersions = require('../commands/s3/AWSGetVersions')

class StoreToVault {
	constructor (params, mode, isFile = false) {
		this.params = params
		this.mode = mode
        this.srcContent = isFile ? this.params.filePath : this.params.folderPath

		const filename = ArchiveUtil.getArchiveName(
			params.appName,
			params.deviceType,
			params.environment,
			params.version
		)

		const distPath = path.join(__dirname, '../../dist')
		FileUtil.ensureDirSync(distPath)

		this.archivePath = path.join(distPath, filename)
		console.log('this.archivePath', this.archivePath)
	}

	async zip () {
		const zipCmd = new ZipFolder() 
		return await zipCmd.execute(this.srcContent, this.archivePath)
	}

	async uploadToS3 () {
		const uploadCmd = new AWSUploadArchive()
		return await uploadCmd.execute(
			this.params.appName,
			this.params.deviceType,
			this.params.environment,
			this.archivePath
		)
	}

	async getS3Versions () {
		const versionsCmd = new AWSGetVersions()
		return await versionsCmd.execute(
			this.params.appName,
			this.params.deviceType,
			this.params.environment,
			this.archivePath
		)
	}

	async updateWorkflowFile (versions, mode) {
		const updateCmd = new UpdateWorkflow(mode)
		return await updateCmd.execute(this.params, versions)
	}

	async commitChanges () {
		const changes = new CommitChanges()
		return await changes.execute()
	}

    invalidAction()
    {
        let invalid = false;
        if (!fs.existsSync(this.srcContent)) {
			core.setOutput('errorMessage', 'source is invalid: ' + this.srcContent)
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

		console.log('Step 1 - zip folder', this.srcContent, 'to', this.archivePath)
		const zipped = await this.zip()
		if (zipped) {
			console.log('Step 2 - upload zip to S3')
			await this.uploadToS3()
		}

		console.log('Step 3 - get available version on S3')
		const updatedVersions = await this.getS3Versions()

		console.log('Step 4 - generate project workflow')
		const wfFileUpdated = await this.updateWorkflowFile(updatedVersions, this.mode)
		if (wfFileUpdated) {
			await this.commitChanges()
			console.log('changes commited, all good')
		}
      
	}
}

module.exports = StoreToVault
