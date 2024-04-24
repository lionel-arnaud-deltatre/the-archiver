const fs = require("fs");

const ZipFolder = require("../commands/zip/ZipFolder");

const params = {
    version: "0.0.1",
    appName: "testApp",
    deviceType: "web",
    environment: "test",
    folderPath: 'resource'
};

const outputPath = 'dist';
const outputFilename = 'test.zip';


if (!fs.existsSync(outputPath))
    fs.mkdirSync(outputPath, { recursive: true });

const zipCmd = new ZipFolder();
zipCmd.execute(params.folderPath, `${outputPath}/${outputFilename}`);
