#!/bin/sh

#zip -r output_file_name.zip /path/to/folder
echo "=> zip -rq $1 $2"

cd "$2" || exit 1
zip -rq $1 ./*
