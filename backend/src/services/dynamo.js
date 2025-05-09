const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

const dynamo = new DynamoDBClient();

async function saveCNJResult(cnj, externalResponse) {
  const params = {
    TableName: process.env.CNJ_RESULTS_TABLE,
    Item: {
      cnj: { S: cnj },
      response: { S: JSON.stringify(externalResponse) },
      createdAt: { S: new Date().toISOString() },
    },
  };

  await dynamo.send(new PutItemCommand(params));
}

module.exports = { saveCNJResult };
