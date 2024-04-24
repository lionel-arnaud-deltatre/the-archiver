const fs = require("fs");
const path = require("path");

class UpdateRBWorkflow {
  constructor() {}

  async execute(params, versionsArray) {
    const versionsString = versionsArray
      .map(
        (item) =>
          `- "${item.version}" (${this.formatDate(item.lastModified)}) - ${this.bytesToMB(item.size)}`
      ).join("\n          ");
    console.log("UpdateRBWorkflow", versionsString);

    const srcFile = path.join(
      __dirname,
      "../../../resource/.rollback-template"
    );
    const destFile = path.join(
      process.env.GITHUB_WORKSPACE,
      `.github/workflows/rollback_${params.deviceType}_${params.environment}.yml`
    );

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
        ["<versions_placeholder>", versionsString],
      ];

      const result = this.replaceAll(data, replacements);
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
      const regex = new RegExp(pair[0], "g");
      str = str.replace(regex, pair[1]);
    }
    return str;
  }

  formatDate(src) {
    const date = new Date(src);

    // Format date in a readable form, e.g., "April 24, 2024 12:33 PM"
    return (
      date.toLocaleDateString("en-US", {
        month: "long", // "long", "short" or "numeric"
        day: "2-digit", // "2-digit" or "numeric"
        year: "numeric", // "2-digit" or "numeric"
      }) +
      " " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit", // "2-digit" or "numeric"
        minute: "2-digit", // "2-digit" or "numeric"
        hour12: true, // true for AM/PM, false for 24-hour clock
      })
    );
  }

  bytesToMB(bytes) {
    const MB = bytes / 1024 / 1024;
    return MB.toFixed(2); // Rounds to two decimal places
  }
}

module.exports = UpdateRBWorkflow;
