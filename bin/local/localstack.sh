#!/bin/bash

# localstackを起動
echo "Start localstack"
docker-compose -f docker-compose.localstack.yml up -d
