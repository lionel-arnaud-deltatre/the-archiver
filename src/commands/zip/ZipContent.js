const fs = require('fs')
const path = require('path')

const ExecCommand = require('../../util/ExecCommand')

class ZipContent {
	async execute (sourceContent, outputFile, isFile = false) {
		if (!isFile && !fs.existsSync(sourceContent)) {
			console.error('ERROR zipping: folder does not exist', sourceContent)
			return false
		}

		const cmd = new ExecCommand()
		const cmdline = [this.getScript(isFile), outputFile, sourceContent]
		const res = await cmd.execute(cmdline)
		return res.error === 0
	}

    getScript(isFile)
    {
        const script = isFile ? 'zip_file' : 'zip_folder';
        return path.join(__dirname, `../../../resource/${script}.sh`);
    }
}

module.exports = ZipContent
