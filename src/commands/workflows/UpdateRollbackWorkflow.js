const fs = require('fs')
const path = require('path')

class UpdateRBWorkflow {
	async execute (params, versionsArray) {
		const versionsString = versionsArray
			.map(
				(item) =>
					`- "${item.version} (${this.formatDate(item.lastModified)} - ${this.bytesToMB(item.size)})"`
			).join('\n          ')
		console.log('UpdateRBWorkflow', versionsString)

		const srcFile = path.join(
			__dirname,
			'../../../resource/.rollback-template'
		)
		const destFile = path.join(
			process.env.GITHUB_WORKSPACE,
			`.github/workflows/rollback_${params.deviceType}_${params.environment}.yml`
		)

		if (!fs.existsSync(srcFile)) {
			console.error('src file does not exists')
			return false
		}

		try {
			const data = fs.readFileSync(srcFile, 'utf8')

			const replacements = [
				['<device_type>', params.deviceType],
				['<env>', params.environment],
				['<project_name>', params.appName],
				['<versions_placeholder>', versionsString]
				['<project_access_key>', process.env.PROJECT_AWS_ACCESS_KEY_ID_SEC]
				['<project_secret>', process.env.PROJECT_AWS_SECRET_ACCESS_KEY_SEC]
				['<project_bucketname>', process.env.PROJECT_BUCKET_NAME_VAR]
				['<project_s3region>', process.env.PROJECT_S3_REGION_VAR]
				['<project_rootfolder>', process.env.PROJECT_ROOT_FOLDER_VAR]
			]

			const result = this.replaceAll(data, replacements)
			fs.writeFileSync(destFile, result)

			return true
		} catch (err) {
			console.error('could not create rollback file', err)
			return false
		}
	}

	replaceAll (str, replacements) {
		for (let index = 0; index < replacements.length; index++) {
			const pair = replacements[index]
            console.log(" - replace pair", pair)
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

module.exports = UpdateRBWorkflow
