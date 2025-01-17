import { SQSEvent, Context } from "aws-lambda";

export const handler = async (event: SQSEvent, context: Context) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  for (const record of event.Records) {
    console.log(`Message Body: ${record.body}`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify("hello"),
  };
};
