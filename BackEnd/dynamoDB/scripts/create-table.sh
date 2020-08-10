#!bin/bash

aws dynamodb create-table \
    --endpoint-url http://localhost:8500 \
    --table-name fleet-dev \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --region eu-central-1