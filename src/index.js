require('dotenv').config();

const core = require("@actions/core");
const StoreFolder = require("./actions/StoreFolder");
const FetchArchive = require("./actions/FetchArchive");


async function run() {
  try {
    const actionType = core.getInput("actionType");

    const params = {
      version: core.getInput("version"),
      appName: core.getInput("appName"),
      deviceType: core.getInput("deviceType"),
      environment: core.getInput("environment"),
      folderPath: `${process.env.GITHUB_WORKSPACE}/${core.getInput("folderPath")}`,
      filePath: core.getInput("filePath"),
    };

    let action = null;
    switch (actionType) {
      case "store-folder": action = new StoreFolder(params); break;
      case "fetch-archive": action = new FetchArchive(params); break;
      
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
