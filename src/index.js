require('dotenv').config()

const core = require('@actions/core')
const StoreToVault = require('./actions/StoreToVault')
const FetchArchive = require('./actions/FetchArchive')
const RollbackArchive = require('./actions/RollbackArchive')

async function run () {
	try {
		const actionType = core.getInput('actionType')

		const params = {
			version: core.getInput('version'),
			appName: core.getInput('appName'),
			deviceType: core.getInput('deviceType'),
			environment: core.getInput('environment'),
			folderPath: `${process.env.GITHUB_WORKSPACE}/${core.getInput('folderPath')}`,
			filePath: `${process.env.GITHUB_WORKSPACE}/${core.getInput('filePath')}`
		}

		let action = null
		switch (actionType) {
		case 'store-folder-with-rollback': action = new StoreToVault(params, "rollback"); break;
		case 'store-folder-with-download': action = new StoreToVault(params, "download"); break;
		case 'store-file-with-download': action = new StoreToVault(params, "download", true); break;
		case 'fetch-archive': action = new FetchArchive(params); break
		case 'rollback-archive': action = new RollbackArchive(params); break

		default:
			break
		}

		if (action) {
			await action.execute()
			console.log('action executed.')
		} else {
			console.log('invalid action, nothing achieved here.')
		}
	} catch (error) {
		core.setFailed(error.message)
	}
}

run()
