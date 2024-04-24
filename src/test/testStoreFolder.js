require('dotenv').config()
const StoreFolder = require('../actions/StoreFolder')

// sinulate params passed by worflow calling the action
const params = {
	version: '0.0.2',
	appName: 'testApp',
	deviceType: 'web',
	environment: 'test',
	folderPath: 'resource'
}

// sinulate env vars passed by worflow calling the action
process.env.ARCHIVER_BUCKET_NAME = 'tv-apps-global'
// process.env.ARCHIVER_S3_REGION = "eu-west-1"
// process.env.ARCHIVER_ROOT_FOLDER = "sotarius"

// use local env for testing
process.env.ARCHIVER_AWS_ACCESS_KEY_ID = process.env.AWS_DEFAULT_ACCESS_KEY_ID
process.env.ARCHIVER_AWS_SECRET_ACCESS_KEY = process.env.AWS_DEFAULTSECRET_ACCESS_KEY

const storeFolder = new StoreFolder(params)
storeFolder.execute()
