#!/bin/sh

# unzip -qq file.zip -d destination_folder
unzip -qq $1 -d $2

echo "check unzipped folder"
cd $2
ls
