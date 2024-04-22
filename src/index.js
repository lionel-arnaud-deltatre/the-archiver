const core = require("@actions/core");
const StoreFolder = require("./actions/StoreFolder");

async function run() {
  try {
    const actionType = core.getInput("actionType");

    const params = {
      version: core.getInput("version"),
      appName: core.getInput("appName"),
      deviceType: core.getInput("deviceType"),
      environment: core.getInput("environment"),
      folderPath: core.getInput("folderPath"),
      filePath: core.getInput("filePath"),
    };

    let action = null;
    switch (actionType) {
      case "store-folder":
        action = new StoreFolder(params);
        break;

      default:
        break;
    }

    if (action) {
      await action.execute();
      console.log("action executed.");
    } else {
      console.log("invalid action, nothing achieved here.");
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
