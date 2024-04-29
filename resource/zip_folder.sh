#!/bin/sh

#zip -r output_file_name.zip /path/to/folder

cd "$2" || exit 1
zip -rq $1 ./*
