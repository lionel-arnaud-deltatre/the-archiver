#!/bin/sh

#zip -r output_file_name.zip /path/to/folder
echo "=> zip -rq $1 $2"

DIR_PATH=$(dirname "$2")
TARGET_DIR=$(basename "$2")

cd "$DIR_PATH"

zip -rq $1 "$TARGET_DIR"
