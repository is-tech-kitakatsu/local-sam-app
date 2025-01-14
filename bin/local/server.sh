#!/bin/bash

echo "Start local server"

echo "Clean up local directory"
sh bin/local/clean.sh
sh bin/local/clean-cdk-out.sh

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

# dynamoDB用のボリュームを作成
echo "Create volume for DynamoDB"
docker volume create dynamodb_data

# dynamoDBのコンテナを起動
echo "Start DynamoDB container"
docker run -d -p 8000:8000 -v dynamodb_data:/home/dynamodblocal/data --network link-for-dynamoDB --name dynamodb-local amazon/dynamodb-local
# もしコンテナの立ち上げに失敗したら、既存のコンテナを再起動する
# 一度でも起動していたら次のようなエラーで失敗する
# docker: Error response from daemon: Conflict. The container name "/dynamodb-local" is already in use by container....
if [ $? -ne 0 ]; then
  echo "Failed to start new DynamoDB Local container. Restarting existing container..."
  docker start dynamodb-local
fi

# ローカルサーバーを起動
echo "Start local server"
sam local start-api --docker-network link-for-dynamoDB -t .aws-sam/build/template.yaml
