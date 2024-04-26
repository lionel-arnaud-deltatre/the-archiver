#!/bin/bash

echo "=> zip -q $1 $2"

# Extract the directory path and filename/item
DIST_PATH="${2%/*}"
ITEM="${2##*/}"

# Change directory
cd "$DIST_PATH" || { echo "Failed to change directory to $DIST_PATH"; exit 1; }

# Zip the items
zip -q "$1" "$ITEM"
