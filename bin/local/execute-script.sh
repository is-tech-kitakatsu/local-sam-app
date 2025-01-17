#!/bin/bash

# 環境変数読み込み
source bin/local/source.sh

# ローカル環境のセットアップ
sh bin/local/setup.sh

# localstackを起動
sh bin/local/localstack.sh

script_name=$1

# script_nameがない場合はエラーをechoする
if [ -z "$script_name" ]; then
  echo "Error: script_name is required"
  exit 1
fi

# スクリプト用のラムダを起動
echo "Start Script Lambda"
echo "{\"body\": \"{\\\"scriptName\\\": \\\"$script_name\\\"}\", \"isBase64Encoded\": false}" | sam local invoke ExecuteScript -e -
