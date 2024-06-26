const path = require('path')
const ExecCommand = require('../../util/ExecCommand')

class CommitChanges {
	async execute () {
		const commitScript = path.join(__dirname, '../../../resource/git_commit.sh')

		const cmd = new ExecCommand(true)
		const cmdline = [commitScript, process.env.GITHUB_WORKSPACE, process.env.APP_NAME]
		const res = await cmd.execute(cmdline)
		return res.error === 0
	}
}

module.exports = CommitChanges
