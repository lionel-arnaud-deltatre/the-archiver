#!/bin/bash

# ITEM supports filename but also wildcard to look up for the first file matching
DIST_PATH="${2%/*}"
ITEM="${2##*/}"

# Change directory
cd "$DIST_PATH" || { echo "Failed to change directory to $DIST_PATH"; exit 1; }

# FILE is the first match of the pattern
files=( ./$ITEM )
FILE="${files[0]}"

zip -q "$1" "$FILE"
