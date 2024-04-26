#!/bin/sh

# unzip file.zip -d destination_folder -q
unzip $1 -d $2 -q

echo "check unzipped folder"
cd $2
ls
