#!bin/bash

if [ "$#" -lt 2 ]; then
    echo "Invalid number of parameters. Usage: sh aws-configure <aws_access_key> <aws_secret_access_key>"
fi

aws configure set aws_access_key_id $1
aws configure set aws_secret_access_key $2
aws configure set default.region eu-central-1