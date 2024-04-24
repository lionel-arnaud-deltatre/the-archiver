#!/bin/sh

export AWS_ACCESS_KEY_ID=$1
export AWS_SECRET_ACCESS_KEY=$2

# aws s3 cp local_file_path s3://bucket_name/path/in/bucket --region your_region
aws s3 cp $3 s3://$4/$5 --region $6
