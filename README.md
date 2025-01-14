# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `npx cdk deploy` deploy this stack to your default AWS account/region
- `npx cdk diff` compare deployed stack with current state
- `npx cdk synth` emits the synthesized CloudFormation template

## 使い方

### インストール

最低限以下をインストールしてください

- AWS CLI

  - https://aws.amazon.com/jp/cli/

- AWS SAM CLI

  - https://docs.aws.amazon.com/ja_jp/serverless-application-model/latest/developerguide/install-sam-cli.html

- node
  - https://docs.aws.amazon.com/ja_jp/serverless-application-model/latest/developerguide/install-sam-cli.html
    https://github.com/nodenv/nodenv - nodenv は例です。nodenv 以外でも node さえインストールされていれば OK です

### 開発環境構築

1. 依存関係インストール

```
npm install
```

2. colima 起動

```sh
colima start
```

colima を利用して docker を起動する場合はこちら。それ以外は何かしらの方法で docker が起動されていること

3. docker のホスト設定

```sh
export DOCKER_HOST=$(docker context inspect | jq -r '.[0].Endpoints.docker.Host')
```

colima を利用して docker を起動する場合はこちら必須。そうでない場合は無視で OK

- 参考: https://github.com/aws/aws-sam-cli/issues/5646

4. 環境立ち上げ

```sh
bin/local/server/sh
```

5. 疎通確認

`localhost:3000`でレスポンスが帰ってくれば疎通確認完了
