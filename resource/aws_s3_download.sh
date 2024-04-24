#!/bin/sh

export AWS_ACCESS_KEY_ID=$1
export AWS_SECRET_ACCESS_KEY=$2

# aws s3 cp s3://bucket-name/path/to/your/file.zip /local/path/to/download/file.zip
aws s3 cp s3://$3/$4 $5 --region $6
