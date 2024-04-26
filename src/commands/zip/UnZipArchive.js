const fs = require('fs')
const path = require('path')

const ExecCommand = require('../../util/ExecCommand')
const FileUtil = require('../../util/FileUtil')

class UnZipArchive {
	async execute (sourceFile, outputFolder) {
		if (!fs.existsSync(sourceFile)) {
			console.error('ERROR unzipping: source file does not exist', sourceFile)
			return false
		}

        FileUtil.ensureDirSync(outputFolder);
        
		const unzipScript = path.join(__dirname, '../../../resource/unzip_archive.sh')

		const cmd = new ExecCommand()
		const cmdline = [unzipScript, sourceFile, outputFolder]
		const res = await cmd.execute(cmdline)
		return res.error === 0
	}
}

module.exports = UnZipArchive
