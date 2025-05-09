const { getProcess } = require("../services/datajud");
const { saveCNJResult } = require("../services/dynamo");

exports.handler = async (event) => {
  const correlationId = Math.random().toString(36).substring(2, 15);

  console.log(JSON.stringify({
    event: "WORKER_START_PROCESSING",
    timestamp: new Date().toISOString(),
    correlationId,
  }));

  for (const record of event.Records) {
    try {
      const message = JSON.parse(record.body);
      const cnj = message.cnj;

      console.log(JSON.stringify({
        event: "WORKER_START_PROCESSING_RECORD",
        timestamp: new Date().toISOString(),
        correlationId,
        cnj
      }));

      const response = await getProcess(cnj);
      console.log(JSON.stringify({
        event: "EXTERNAL_API_RESPONSE",
        timestamp: new Date().toISOString(),
        correlationId,
        cnj,
        status: response.status,
        hits: response.hits?.total?.value,
        hasResults: response.hits?.total?.value > 0
      }));

      const isSuccess = response.status === 200;
      const hasResults = response.hits?.total?.value > 0;

      if (isSuccess && hasResults) {
        await saveCNJResult(cnj, response.data);
        console.log(JSON.stringify({
          event: "DYNAMO_SAVE_SUCCESS",
          timestamp: new Date().toISOString(),
          correlationId,
          cnj,
          result: "success"
        }));
      }

      if (isSuccess && !hasResults) {
        await saveCNJResult(cnj, {
          error: false,
          status: response.status,
          message: "Processo não encontrado",
          data: response.data,
        });
        console.log(JSON.stringify({
          event: "DYNAMO_SAVE_NO_RESULT",
          timestamp: new Date().toISOString(),
          correlationId,
          cnj
        }));
        return;
      }

      await saveCNJResult(cnj, {
        error: true,
        status: response.status,
        data: response.data,
        message: "Erro ao consultar API externa",
      });
      console.warn(JSON.stringify({
        event: "DYNAMO_SAVE_EXTERNAL_ERROR",
        timestamp: new Date().toISOString(),
        correlationId,
        cnj
      }));

      if (response.status >= 500) {
        throw new Error(`Erro temporário da API externa: ${response.status}`);
      }
    } catch (error) {
      console.error(JSON.stringify({
        event: "WORKER_PROCESSING_ERROR",
        timestamp: new Date().toISOString(),
        correlationId,
        error: error && error.message,
        stack: error && error.stack
      }));
      throw error;
    }
  }
  console.log(JSON.stringify({
    event: "WORKER_FINISHED_ALL",
    timestamp: new Date().toISOString(),
    correlationId
  }));
  return { status: "done" };
};
