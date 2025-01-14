#!/bin/bash

echo "Start local server"

echo "Clean up local directory"
sh bin/local/clean.sh

# CloudFormationのテンプレートを生成
echo "Start build to template.yaml"
cdk synth > template.yaml

# CloudFormationのテンプレートを生成
echo "Start build to .aws-sam/build/template.yaml"
sam build

echo "Copy assets"
# cdk.out以下のassetを含む名前のディレクトリを実行中のディレクトリ直下に全部コピー
for dir in cdk.out/*; do
  if [[ -d "$dir" && "$dir" == *asset* ]]; then
    cp -r "$dir" .
  fi
done

# dynamoDB用のネットワークを作成
echo "Create network for DynamoDB"
docker network create link-for-dynamoDB

# dynamoDBのコンテナを起動
echo "Start DynamoDB container"
docker run -d -p 8000:8000 --network link-for-dynamoDB --name dynamodb amazon/dynamodb-local

# ローカルサーバーを起動
echo "Start local server"
sam local start-api --docker-network link-for-dynamoDB -t .aws-sam/build/template.yaml
