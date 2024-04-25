require('dotenv').config()

const core = require('@actions/core')
const StoreFolder = require('./actions/StoreFolder')
const FetchArchive = require('./actions/FetchArchive')

async function run () {
	try {
		const actionType = core.getInput('actionType')

		const params = {
			version: core.getInput('version'),
			appName: core.getInput('appName'),
			deviceType: core.getInput('deviceType'),
			environment: core.getInput('environment'),
			folderPath: `${process.env.GITHUB_WORKSPACE}/${core.getInput('folderPath')}`,
			filePath: core.getInput('filePath')
		}

		let action = null
		switch (actionType) {
		case 'store-folder-with-rollback': action = new StoreFolder(params, "rollback"); break;
		case 'store-folder-with-download': action = new StoreFolder(params, "download"); break;
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
