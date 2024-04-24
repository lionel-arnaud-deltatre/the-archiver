#!/bin/sh

export AWS_ACCESS_KEY_ID=$1
export AWS_SECRET_ACCESS_KEY=$2

aws s3api list-objects --bucket $3 --prefix $4 --region $5 --output json
