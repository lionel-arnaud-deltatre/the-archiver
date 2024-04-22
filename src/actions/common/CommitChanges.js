const ExecCommand = require("../util/ExecCommand");

class CommitChanges {
  constructor() {}

  async commit() {
    const cmdline = ["osascript", "-e", 'quit app "electron"'];

    const cmd = new ExecCommand();
    const res = await cmd.execute(cmdline);

    console.log("res ", res);
  }
}

module.exports = CommitChanges

/*

steps:
  - name: Check action type and push new file if needed
    run: |
      if [ "${{ inputs.actionType }}" == "store-folder" ]; then
        # Add your logic here for the fake-action
        # For example, create a new file and push to the repository
        echo "Commit changes..."
        git config --global user.email "action@github.com"
        git config --global user.name "GitHub Actions"
        git add .
        git commit -m "Update versions"
        git push
      else
        echo "Action type not recognized or no action needed for this type."
      fi
      */