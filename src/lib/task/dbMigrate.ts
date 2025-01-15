import {
  CreateTableCommand,
  DynamoDBClient,
  KeySchemaElement,
  KeyType,
} from "@aws-sdk/client-dynamodb";
import { tableDefinitions } from "../../domain/dynamoDB/table";

const client = new DynamoDBClient({
  endpoint: "http://host.docker.internal:8000", // Dockerのローカルホストエンドポイント
  region: "ap-northeast-1",
});

export const dbMigrate = async () => {
  for (const tableDefinition of tableDefinitions) {
    const attributeDefinitions = [
      {
        AttributeName: tableDefinition.partitionKey.name,
        AttributeType: tableDefinition.partitionKey.type,
      },
      ...(tableDefinition.sortKey
        ? [
            {
              AttributeName: tableDefinition.sortKey.name,
              AttributeType: tableDefinition.sortKey.type,
            },
          ]
        : []),
    ];
    const keySchema: KeySchemaElement[] | undefined = [
      {
        AttributeName: tableDefinition.partitionKey.name,
        KeyType: KeyType.HASH,
      },
      ...(tableDefinition.sortKey
        ? [
            {
              AttributeName: tableDefinition.sortKey.name,
              KeyType: KeyType.RANGE,
            },
          ]
        : []),
    ];

    try {
      const res = await client.send(
        new CreateTableCommand({
          TableName: tableDefinition.tableName,
          AttributeDefinitions: attributeDefinitions,
          KeySchema: keySchema,
          BillingMode: tableDefinition.billingMode,
        })
      );
      console.log(`created table: ${res.TableDescription?.TableName}`);
    } catch (error: any) {
      if (error.name === "ResourceInUseException") {
        console.log(`Table ${tableDefinition.tableName} already exists`);
      }
    }
  }
};
