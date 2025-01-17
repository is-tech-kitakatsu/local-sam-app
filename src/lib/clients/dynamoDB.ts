import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const dynamoDBClient = new DynamoDBClient({
  endpoint: process.env.DYNAMODB_ENDPOINT,
});
