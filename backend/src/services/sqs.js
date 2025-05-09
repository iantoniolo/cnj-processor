const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const sqs = new SQSClient();

async function sendToQueue(queueUrl, message) {
  const params = {
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(message),
  };
  await sqs.send(new SendMessageCommand(params));
}
module.exports = { sendToQueue };
