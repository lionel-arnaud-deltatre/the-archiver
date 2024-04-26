#!/bin/sh

export AWS_ACCESS_KEY_ID=$1
export AWS_SECRET_ACCESS_KEY=$2

# Clear the S3 bucket folder
aws s3 rm s3://$4/$5 --recursive --region $6

# Upload new files to the S3 bucket folder
aws s3 cp $3 s3://$4/$5 --recursive --region $6
