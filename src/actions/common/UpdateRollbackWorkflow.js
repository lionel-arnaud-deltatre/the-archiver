const fs = require("fs");
const path = require("path");

class UpdateRBWorkflow {
    constructor() {

    }

    async update(target, versionsArray)
    {
        const versionsString = versionsArray.map(item => `- "${item.version}"`).join("\n          ");
    
        const srcFile = path.join(__dirname, '../../workflows/.rollback-template');
        const destFile = path.join(process.env.GITHUB_WORKSPACE, `.github/workflows/rollback_${target}.yml`)

        console.log("copy template")
        console.log("__dirname", __dirname)
        console.log("process.env.GITHUB_WORKSPACE", process.env.GITHUB_WORKSPACE)
        console.log("srcFile", srcFile, fs.existsSync(srcFile))
        console.log("destFile", destFile, fs.existsSync(destFile))
        console.log("versionsString", versionsString)

        if (!fs.existsSync(srcFile)) {
            console.error("src file does not exists")
            return;
        }
        if (!fs.existsSync(destFile)) {
            console.error("dest file does not exists")
            return;
        };

        fs.readFile(srcFile, 'utf8', (err, data) => {
            if (err) {
                console.error("Failed to read template file:", err);
                return;
            }
    
            const result = data.replace('<versions_placeholder>', versionsString);
    
            fs.writeFile(destFile, result, 'utf8', (err) => {
                if (err) {
                    console.error("Failed to write output file:", err);
                } else {
                    console.log("Workflow file created successfully.");
                }
            });
        });
    }
}

module.exports = UpdateRBWorkflow