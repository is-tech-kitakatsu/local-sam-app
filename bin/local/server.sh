#!/bin/bash

# 環境変数読み込み
source bin/local/source.sh

# ローカル環境のセットアップ
sh bin/local/setup.sh

# localstackを起動
sh bin/local/localstack.sh

# ローカルサーバーを起動
# docker-networkはdocker-compose.localstack.ymlで作成したネットワークを指定
echo "Start local server"
sam local start-api --docker-network local-sam-app_localstack_network -t .aws-sam/build/template.yaml
