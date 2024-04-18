#!/bin/sh

echo "actionType: $1"
echo "appName: $2"
echo "deviceType: $3"
echo "version: $4"
echo "folderPath: $5"
echo "filePath: $6"

cd /usr/src/app
ls
node ./storeFolder/index.js
