#!/bin/bash

aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name SqsMyQueue --message-body "Hello from local SQS"
aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name SqsMyQueue
aws --endpoint-url=http://localhost:4566 sqs send-message \
    --queue-url http://sqs.ap-northeast-1.localhost.localstack.cloud:4566/000000000000/SqsMyQueue \
    --message-body "Hello from SQS!"
aws --endpoint-url=http://host.docker.internal:4566 sqs send-message \
    --queue-url http://host.docker.internal:4566/000000000000/SqsMyQueue \
    --message-body "Hello from SQS!"


aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name SqsMyQueue
aws --endpoint-url=http://localhost:4566 sqs send-message --queue-url http://sqs.ap-northeast-1.localhost.localstack.cloud:4566/000000000000/SqsMyQueue --message-body "Hello from SQS"
# aws --endpoint-url=http://localhost:4566 sqs receive-message --queue-url http://sqs.ap-northeast-1.localhost.localstack.cloud:4566/000000000000/SqsMyQueue