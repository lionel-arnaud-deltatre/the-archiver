const fs = require("fs");
const path = require("path");

class UpdateRBWorkflow {
  constructor() {}

  async update(target, versionsArray) {
    
    const versionsString = versionsArray.map((item) => `- "${item.version}"`).join("\n          ");
    console.log("UpdateRBWorkflow", versionsString)

    const srcFile = path.join(__dirname, "../../../workflows/.rollback-template");
    const destFile = path.join(process.env.GITHUB_WORKSPACE,`.github/workflows/rollback_${target}.yml`);

    if (!fs.existsSync(srcFile)) {
      console.error("src file does not exists");
      return false;
    }

    try {
      const data = fs.readFileSync(srcFile, "utf8");

      let result = data.replace("<target>", target);
      result = result.replace("<versions_placeholder>", versionsString);
      fs.writeFileSync(destFile, result);

      console.error("created updated rollback for", target);

      return true;
    } catch (err) {
      console.error("could not create rollback file", err);
      return false;
    }
  }
}

module.exports = UpdateRBWorkflow;
