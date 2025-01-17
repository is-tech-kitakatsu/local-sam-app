#!/bin/bash

# 環境変数読み込み
source bin/local/source.sh

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
