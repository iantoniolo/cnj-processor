import http from "k6/http";

export let options = {
  vus: 1,
  iterations: 100,
  duration: "1m",
};

export default function () {
  const url = `${__ENV.API_URL}`;
  const payload = JSON.stringify({ cnj: "00008323520184013202" });
  const params = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${__ENV.API_TOKEN}`,
    },
  };

  const res = http.post(url, payload, params);
  console.log(`Status: ${res.status}, Body: ${res.body}`);
}
