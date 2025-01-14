import { Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { tableDefinitions } from "../src/domain/dynamoDB/table";

export class SampleStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // DynamoDBテーブルの作成
    // const table = new dynamodb.Table(this, "ExampleTable", {
    //   partitionKey: { name: "id", type: dynamodb.AttributeType.STRING }, // 主キー
    //   tableName: "ExampleTable",
    //   removalPolicy: RemovalPolicy.DESTROY, // スタック削除時にテーブルも削除
    //   billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // オプション: 従量課金モード
    // });

    tableDefinitions.forEach((tableDefinition) => {
      new dynamodb.Table(this, tableDefinition.TableName, {
        partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
        tableName: tableDefinition.TableName,
        removalPolicy: RemovalPolicy.DESTROY,
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      });
    });

    const backend = new lambda.NodejsFunction(this, "MyFunction", {
      entry: "src/lambda/hello/index.ts", // accepts .js, .jsx, .ts, .tsx and .mjs files
      handler: "handler", // defaults to 'handler'
      memorySize: 512, // メモリサイズを512MBに設定
      environment: {
        TABLE_NAME: table.tableName,
        DYNAMODB_ENDPOINT: "http://host.docker.internal:8000", // ローカルのDynamoDB Local
      },
      timeout: Duration.seconds(30), // 30秒に設定
    });

    // LambdaにDynamoDBアクセス権限を付与
    table.grantReadWriteData(backend);

    // API Gatewayを追加
    new apigateway.LambdaRestApi(this, "myApi", {
      handler: backend,
    });
  }
}
