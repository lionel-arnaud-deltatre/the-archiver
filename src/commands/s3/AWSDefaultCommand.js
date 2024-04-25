class AWSDefaultCommand {
	constructor (cmdType) {
        switch (cmdType) {
            case "download": this.initStore(); break;
            case "getversions": this.initStore(); break;
            case "upload": this.initStore(); break;
        
            default:
                break;
        }

        console.log('setup s3')
		console.log(' - as key ID available', this.AWSkeyID != null)
		console.log(' - as key Secret available', this.AWSSecret != null)
		console.log(' - bucketName', this.bucketName)
		console.log(' - region', this.bucketRegion)
	}

	initStore () {  
        // use provided root folder for archives, use internal is not
        this.rootFolder = process.env.ARCHIVER_ROOT_FOLDER || process.env.AWS_DEFAULT_ROOT_FOLDER

        // use bucket vars if provided, use project if not
		this.bucketName = process.env.ARCHIVER_BUCKET_NAME || process.env.PROJECT_AWS_BUCKET_NAME
		this.bucketRegion = process.env.ARCHIVER_S3_REGION || process.env.PROJECT_S3_REGION || process.env.AWS_DEFAULT_REGION

        this.AWSkeyID = process.env.ARCHIVER_AWS_ACCESS_KEY_ID || process.env.PROJECT_AWS_ACCESS_KEY_ID
        this.AWSSecret = process.env.ARCHIVER_AWS_SECRET_ACCESS_KEY || process.env.PROJECT_AWS_SECRET_ACCESS_KEY
	}

	getS3ArchivePath (appName, device, env) {
		return `${this.rootFolder}/${appName}/${device}/${env}/`
	}
}

module.exports = AWSDefaultCommand
