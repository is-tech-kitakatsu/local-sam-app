#!/bin/bash

sh bin/local/setup.sh

# ローカルサーバーを起動
echo "Start local server"
sam local start-api --docker-network link-for-dynamoDB -t .aws-sam/build/template.yaml
