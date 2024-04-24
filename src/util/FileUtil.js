const fs = require("fs");

class FileUtil {
    static ensureDirSync(folderPath)
    {
        if (!fs.existsSync(folderPath))
            fs.mkdirSync(folderPath, { recursive: true });
    }
}

module.exports = FileUtil