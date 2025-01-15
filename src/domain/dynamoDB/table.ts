import { RemovalPolicy } from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export const exampleTable = "ExampleTable";
export const testTable = "TestTable";
export const testTable2 = "TestTable2";

const commonTableDefinition = {
  removalPolicy: RemovalPolicy.DESTROY,
  billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
};

export const tableDefinitions: dynamodb.TableProps[] = [
  {
    tableName: exampleTable,
    partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
    // AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
    // KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    ...commonTableDefinition,
  },
  {
    tableName: testTable,
    partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
    // AttributeDefinitions: [{ AttributeName: "id", AttributeType: "N" }],
    // KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    ...commonTableDefinition,
  },
  {
    tableName: testTable2,
    partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
    // AttributeDefinitions: [{ AttributeName: "id", AttributeType: "N" }],
    // KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    ...commonTableDefinition,
  },
];
