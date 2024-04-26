#!/bin/sh

#zip -r output_file_name.zip /path/to/folder
echo "=> zip -rq $1 $2"
zip -rq $1 $2
