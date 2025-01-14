export const tableDefinitions = [
  {
    TableName: "ExampleTable",
    AttributeDefinitions: [{ AttributeName: "Id", AttributeType: "S" }],
    KeySchema: [{ AttributeName: "Id", KeyType: "HASH" }],
    BillingMode: "PAY_PER_REQUEST",
  },
  {
    TableName: "TestTable",
    AttributeDefinitions: [{ AttributeName: "Id", AttributeType: "N" }],
    KeySchema: [{ AttributeName: "Id", KeyType: "HASH" }],
    BillingMode: "PAY_PER_REQUEST",
  },
];
