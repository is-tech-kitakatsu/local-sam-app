import { Logger } from "@aws-lambda-powertools/logger";
import { injectLambdaContext } from "@aws-lambda-powertools/logger/middleware";
import {
  PutItemCommand,
  GetItemCommand,
  CreateTableCommand,
} from "@aws-sdk/client-dynamodb";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import inputOutputLogger from "@middy/input-output-logger";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import validator from "@middy/validator";
import { transpileSchema } from "@middy/validator/transpile";
import errorLogger from "@middy/error-logger";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { dynamoDBClient } from "../../../lib/clients/dynamoDB";

const logger = new Logger({
  logLevel: "INFO",
  serviceName: "hello",
});

const eventSchema = transpileSchema({
  type: "object",
  // required: ['body', 'foo'],
  properties: {
    body: {
      type: "string",
    },
  },
});

const responseSchema = transpileSchema({
  type: "object",
  required: ["body", "statusCode"],
  properties: {
    body: {
      type: "string",
    },
    statusCode: {
      type: "number",
    },
  },
});

const main = async function (_event: any, _context: any) {
  await dynamoDBClient.send(
    new CreateTableCommand({
      TableName: "ExampleTable",
      AttributeDefinitions: [{ AttributeName: "Id", AttributeType: "S" }],
      KeySchema: [{ AttributeName: "Id", KeyType: "HASH" }],
      BillingMode: "PAY_PER_REQUEST",
    })
  );

  // DynamoDBにデータを追加
  const putParams = {
    TableName: "ExampleTable",
    Item: {
      Id: { S: "123" },
      name: { S: "Test Item" },
    },
  };
  await dynamoDBClient.send(new PutItemCommand(putParams));

  // DynamoDBからデータを取得
  const getParams = {
    TableName: "ExampleTable",
    Key: {
      Id: { S: "123" },
    },
  };
  const result = await dynamoDBClient.send(new GetItemCommand(getParams));

  return {
    headers: {
      "Content-Type": "application/json",
    },
    statusCode: 200,
    body: JSON.stringify({ message: "Success", data: result.Item }),
  };
};

export const handler = middy()
  .use(injectLambdaContext(logger)) // ログ注入（最初に実行）
  .use(httpHeaderNormalizer()) // ヘッダーの正規化
  .use(httpJsonBodyParser()) // JSONボディの解析
  .use(validator({ eventSchema })) // リクエストスキーマのバリデーション
  .use(inputOutputLogger()) // 入力/出力ログの記録
  .use(validator({ responseSchema })) // レスポンススキーマのバリデーション
  .use(errorLogger()) // エラーログ
  .use(httpErrorHandler()) // エラーハンドラー（最後に実行）
  .handler(main);
