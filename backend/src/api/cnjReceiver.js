const { validateToken } = require("../utils/validateToken");
const { sendToQueue } = require("../services/sqs");

exports.handler = async (event) => {
  const requestId = event.requestContext?.requestId || event.requestContext?.requestId || Math.random().toString(36).substring(2, 15);
  console.log(JSON.stringify({
    event: "CNJ_RECEIVED_REQUEST",
    timestamp: new Date().toISOString(),
    requestId,
    headers: {
      'User-Agent': event.headers?.['User-Agent'],
      'X-Forwarded-For': event.headers?.['X-Forwarded-For']
    },
    body: event.body
  }));
  try {
    const authHeader =
      event.headers?.Authorization || event.headers?.authorization;
    const { valid, message } = validateToken(authHeader);
    if (!valid) {
      console.warn(JSON.stringify({
        event: "AUTH_FAILED",
        timestamp: new Date().toISOString(),
        requestId,
        reason: message
      }));
      return {
        statusCode: 401,
        body: JSON.stringify({ message }),
      };
    }

    const body = JSON.parse(event.body);
    if (!body.cnj || typeof body.cnj !== "string" || body.cnj.trim() === "") {
      console.warn(JSON.stringify({
        event: "VALIDATION_FAILED",
        timestamp: new Date().toISOString(),
        requestId,
        reason: 'O campo "cnj" é obrigatório e deve ser uma string.',
        body
      }));
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'O campo "cnj" é obrigatório e deve ser uma string.',
        }),
      };
    }

    try {
      await sendToQueue(process.env.CNJ_QUEUE_URL, { cnj: body.cnj });
      console.log(JSON.stringify({
        event: "CNJ_SENT_TO_QUEUE",
        timestamp: new Date().toISOString(),
        requestId,
        cnj: body.cnj
      }));
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "CNJ recebido e enviado para processamento assíncrono.",
          cnj: body.cnj,
        }),
      };
    } catch (err) {
      console.error(JSON.stringify({
        event: "QUEUE_SEND_ERROR",
        timestamp: new Date().toISOString(),
        requestId,
        error: err && err.message,
        stack: err && err.stack
      }));
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Erro ao enviar para fila de processamento.",
        }),
      };
    }
  } catch (error) {
    console.error(JSON.stringify({
      event: "REQUEST_PROCESSING_ERROR",
      timestamp: new Date().toISOString(),
      requestId,
      error: error && error.message,
      stack: error && error.stack
    }));
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Erro interno do servidor." }),
    };
  }
};
