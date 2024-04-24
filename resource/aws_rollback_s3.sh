#!/bin/sh

export AWS_ACCESS_KEY_ID="your_access_key_id_here"
export AWS_SECRET_ACCESS_KEY="your_secret_access_key_here"

echo "Clean the S3 bucket 🧴"
aws s3 
echo "Clean the S3 bucket 🧴"
aws s3 rm --recursive --quiet s3://${AWS_BUCKET_NAME}/
echo "Upload to the S3 bucket 🌪️"
aws s3 cp "./bin/app/pub" "s3://${AWS_BUCKET_NAME}/" --cache-control max-age=${AWS_CACHE_MAX_AGE} --recursive
echo "Done 🍻"
