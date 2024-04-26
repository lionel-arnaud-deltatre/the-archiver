const fs = require('fs')
const path = require('path')

const ExecCommand = require('../../util/ExecCommand')

class ZipContent {
	async execute (sourceDir, outputFile, isFile = false) {
		if (!isFile && !fs.existsSync(sourceDir)) {
			console.error('ERROR zipping: folder does not exist', sourceDir)
			return false
		}

		const cmd = new ExecCommand()
		const cmdline = [this.getScript(isFile), outputFile, sourceDir]
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
