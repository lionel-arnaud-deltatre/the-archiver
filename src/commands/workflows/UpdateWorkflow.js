const fs = require('fs')
const path = require('path')

class UpdateWorkflow {
	constructor(mode) {
		this.mode = mode
	}

	getWorkflowSettings(params)
	{
		let template = '';
		let wf_prefix = '';
		switch (this.mode) {
            case "rollback": template = '.rollback-template'; wf_prefix = 'rollback'; break;
            case "download": template = '.download-template'; wf_prefix = 'download'; break;
		}
		return {
			srcFile: path.join(__dirname, '../../../resource/', template),
			destFile: path.join( process.env.GITHUB_WORKSPACE, `.github/workflows/${wf_prefix}_${params.deviceType}_${params.environment}.yml`)
		}
	}

	async execute (params, versionsArray) {
		const versionsString = versionsArray.map( (item) =>	`- "${item.version} (${this.formatDate(item.lastModified)} - ${this.bytesToMB(item.size)})"`			).join('\n          ')
		console.log('Update/create Workflow', versionsString)

		const config = this.getWorkflowSettings(params);
		
		if (!fs.existsSync(config.srcFile)) {
			console.error('src file does not exists')
			return false
		}

		try {
			const data = fs.readFileSync(config.srcFile, 'utf8')

			let replacements = [
				['<device_type>', params.deviceType],
				['<env>', params.environment],
				['<project_name>', params.appName],
				['<versions_placeholder>', versionsString],
				['<project_access_key>', process.env.PROJECT_AWS_ACCESS_KEY_ID_SEC],
				['<project_secret>', process.env.PROJECT_AWS_SECRET_ACCESS_KEY_SEC]
			]

            if (this.mode === "rollback") {
                const downloadReplacements = [
                    ['<project_bucketname>', process.env.PROJECT_BUCKET_NAME],
                    ['<project_s3region>', process.env.PROJECT_S3_REGION],
                    ['<project_rootfolder>', process.env.PROJECT_ROOT_FOLDER]
                ]
                replacements = replacements.concat(downloadReplacements);
            }

			const result = this.replaceAll(data, replacements)
			fs.writeFileSync(config.destFile, result)

			return true
		} catch (err) {
			console.error('could not create rollback file', err)
			return false
		}
	}

	replaceAll (str, replacements) {
		for (let index = 0; index < replacements.length; index++) {
			const pair = replacements[index]
			const regex = new RegExp(pair[0], 'g')
			str = str.replace(regex, pair[1])
		}
		return str
	}

	formatDate (src) {
		const date = new Date(src)

		// Format date in a readable form, e.g., "April 24, 2024 12:33 PM"
		return (
			date.toLocaleDateString('en-US', {
				month: 'long', // "long", "short" or "numeric"
				day: '2-digit', // "2-digit" or "numeric"
				year: 'numeric' // "2-digit" or "numeric"
			}) +
      ' ' +
      date.toLocaleTimeString('en-US', {
      	hour: '2-digit', // "2-digit" or "numeric"
      	minute: '2-digit', // "2-digit" or "numeric"
      	hour12: true // true for AM/PM, false for 24-hour clock
      })
		)
	}

	bytesToMB (bytes) {
		if (bytes < 1000) return bytes.toFixed(2) + 'bytes'

		const kb = bytes / 1024
		if (kb < 1000) return kb.toFixed(2) + 'kb'

		const MB = bytes / 1024 / 1024
		return MB.toFixed(2) + 'Mb'
	}
}

module.exports = UpdateWorkflow
