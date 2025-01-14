import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as path from "path";
import { Code } from "aws-cdk-lib/aws-lambda";

export class SampleStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const backend = new lambda.NodejsFunction(this, "MyFunction", {
      entry: "lambda/hello/index.ts", // accepts .js, .jsx, .ts, .tsx and .mjs files
      handler: "handler", // defaults to 'handler'
      memorySize: 512, // メモリサイズを512MBに設定
    });

    // API Gatewayを追加
    new apigateway.LambdaRestApi(this, "myApi", {
      handler: backend,
    });
  }
}
