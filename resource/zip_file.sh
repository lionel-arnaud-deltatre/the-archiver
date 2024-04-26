#!/bin/bash

# Echo the intended command (useful for debugging)
echo "=> zip -q $1 $2"

# Extract the directory path and filename/item
DIST_PATH="${2%/*}"
ITEM="${2##*/}"

echo "cd to $DIST_PATH"
echo "and attempt to zip $ITEM"

# Change directory
cd "$DIST_PATH" || { echo "Failed to change directory to $DIST_PATH"; exit 1; }

# List files for debugging
echo "Listing files in the directory:"
ls

files=( ./$ITEM )
FILE="${files[0]}"

echo "zipping file $FILE"

# Use the wildcard to zip all APK files in the directory using double quotes for variables
zip -q "$1" "$FILE"
