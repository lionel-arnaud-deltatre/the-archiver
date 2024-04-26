#!/bin/bash

# Echo the intended command (useful for debugging)
echo "=> zip -q $1 $2"

# Extract the directory path and filename/item
DIST_PATH="${2%/*}"
ITEM="${2##*/}"

echo "cd to $DIST_PATH"
echo "and zip $ITEM"

# Change directory
cd "$DIST_PATH" || { echo "Failed to change directory to $DIST_PATH"; exit 1; }

# Zip the items
zip "$1" "$ITEM"
