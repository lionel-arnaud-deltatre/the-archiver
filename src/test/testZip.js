const fs = require("fs");

const ArchiveManager = require("../actors/ArchiveManager");

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

const archiver = new ArchiveManager();
//archiver.zipFolder(params.folderPath, `${outputPath}/${outputFilename}`);

archiver.zipFolderSH(params.folderPath, `${outputPath}/${outputFilename}`); // using sh script
