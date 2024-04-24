const fs = require("fs");
const path = require("path");

class UpdateRBWorkflow {
  constructor() {}

  async execute(params, versionsArray) {
    
    const versionsString = versionsArray.map((item) => `- "${item.version}"`).join("\n          ");
    console.log("UpdateRBWorkflow", versionsString)

    const srcFile = path.join(__dirname, "../../../resource/.rollback-template");
    const destFile = path.join(process.env.GITHUB_WORKSPACE,`.github/workflows/rollback_${params.deviceType}_${params.environment}.yml`);

    if (!fs.existsSync(srcFile)) {
      console.error("src file does not exists");
      return false;
    }

    try {
      const data = fs.readFileSync(srcFile, "utf8");

      const replacements = [
        ["<device_type>", params.deviceType], 
        ["<env>", params.environment], 
        ["<project_name>", params.appName], 
        ["<versions_placeholder>", versionsString]
      ]

      const result = this.replaceAll(data ,replacements);
      fs.writeFileSync(destFile, result);

      return true;
    } catch (err) {
      console.error("could not create rollback file", err);
      return false;
    }
  }

  replaceAll(str, replacements) {
    for (let index = 0; index < replacements.length; index++) {
      const pair = replacements[index];
      const regex = new RegExp(pair[0], 'g');
      str = str.replace(regex, pair[1]);
    }
    return str;
  }
}

module.exports = UpdateRBWorkflow;
