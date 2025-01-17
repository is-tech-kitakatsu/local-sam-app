import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { tableDefinitions } from "../src/domain/dynamoDB/table";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as eventSources from "aws-cdk-lib/aws-lambda-event-sources";
import * as lambda from "aws-cdk-lib/aws-lambda";

export class SampleStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const commonEnv = {
      DYNAMODB_ENDPOINT: process.env.DYNAMODB_ENDPOINT as string,
      SQS_ENDPOINT: process.env.SQS_ENDPOINT as string,
    };
    if (!commonEnv.DYNAMODB_ENDPOINT || !commonEnv.SQS_ENDPOINT) {
      throw new Error("環境変数が設定されていません");
    }

    const tables = tableDefinitions.map((tableDefinition) => {
      return new dynamodb.Table(this, tableDefinition.tableName as string, {
        partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
        tableName: tableDefinition.tableName,
        removalPolicy: tableDefinition.removalPolicy,
        billingMode: tableDefinition.billingMode,
      });
    });

    // SQS キューの作成
    const sqsMyQueue = new sqs.Queue(this, "SqsMyQueue", {
      queueName: "SqsMyQueue",
      retentionPeriod: Duration.days(4), // メッセージ保持期間
      visibilityTimeout: Duration.seconds(30), // 可視性タイムアウト
    });

    const backendExecuteScript = new lambdaNodejs.NodejsFunction(
      this,
      "ExecuteScript",
      {
        entry: "src/lambda/script/index.ts", // accepts .js, .jsx, .ts, .tsx and .mjs files
        handler: "handler", // defaults to 'handler'
        memorySize: 512, // メモリサイズを512MBに設定
        environment: {
          ...commonEnv,
        },
        timeout: Duration.seconds(30), // 30秒に設定
      }
    );

    const backend = new lambdaNodejs.NodejsFunction(this, "MyFunction", {
      entry: "src/lambda/api/hello/index.ts", // accepts .js, .jsx, .ts, .tsx and .mjs files
      handler: "handler", // defaults to 'handler'
      memorySize: 512, // メモリサイズを512MBに設定
      environment: {
        ...commonEnv,
      },
      timeout: Duration.seconds(30), // 30秒に設定
    });

    // Lambda 関数の作成
    const sqsMyLambda = new lambdaNodejs.NodejsFunction(this, "SQSMyFunction", {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: "src/lambda/sqs/hello/index.ts",
      handler: "handler",
      memorySize: 512, // メモリサイズを512MBに設定
      environment: {
        ...commonEnv,
      },
      timeout: Duration.seconds(30), // 30秒に設定
    });

    // Lambda に SQS をイベントソースとして追加
    sqsMyLambda.addEventSource(
      new eventSources.SqsEventSource(sqsMyQueue, {
        batchSize: 5, // 1 回で Lambda に渡すメッセージの最大数
      })
    );

    // Lambda 関数が SQS メッセージを受け取るための権限を付与
    sqsMyQueue.grantConsumeMessages(sqsMyLambda);

    // LambdaにDynamoDBアクセス権限を付与
    tables.forEach((table) => {
      table.grantReadWriteData(backendExecuteScript);
      table.grantReadWriteData(backend);
    });

    // API Gatewayを追加
    new apigateway.LambdaRestApi(this, "myApi", {
      handler: backend,
    });
  }
}
