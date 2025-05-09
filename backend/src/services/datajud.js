const axios = require("axios");

const DATAJUD_API_URL =
  "https://api-publica.datajud.cnj.jus.br/api_publica_trf1/_search";

async function getProcess(cnj) {
  const payload = {
    query: {
      match: {
        numeroProcesso: cnj,
      },
    },
  };

  const headers = {
    Authorization: `APIKey ${process.env.DATAJUD_API_TOKEN}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(DATAJUD_API_URL, payload, { headers });
    return response;
  } catch (error) {
    throw error;
  }
}

module.exports = { getProcess };
