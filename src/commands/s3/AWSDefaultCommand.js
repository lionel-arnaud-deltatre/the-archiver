class AWSDefaultCommand {
	constructor () {
		this.init()
	}

	init () {
		this.bucketName = process.env.ARCHIVER_BUCKET_NAME
		this.rootFolder = process.env.ARCHIVER_ROOT_FOLDER || process.env.AWS_DEFAULT_ROOT_FOLDER
		this.bucketRegion = process.env.ARCHIVER_S3_REGION || process.env.AWS_DEFAULT_REGION

		console.log('setup s3')
		console.log(' - as key ID available', process.env.ARCHIVER_AWS_ACCESS_KEY_ID != null)
		console.log(' - as key Secret available', process.env.ARCHIVER_AWS_SECRET_ACCESS_KEY != null)
		console.log(' - bucketName', this.bucketName)
		console.log(' - region', this.bucketRegion)
	}

	getS3ArchivePath (appName, device, env) {
		return `${this.rootFolder}/${appName}/${device}/${env}/`
	}
}

module.exports = AWSDefaultCommand
