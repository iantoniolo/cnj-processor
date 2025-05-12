# Backend — CNJ Processor

Backend responsável pelo processamento dos dados do CNJ, utilizando arquitetura serverless na AWS (Lambda, SQS, DynamoDB, API Gateway, CloudWatch) para validação, processamento assíncrono e integração com APIs externas.

## Arquitetura

O backend segue um fluxo serverless conforme o diagrama abaixo:

![Diagrama da Arquitetura](https://imgur.com/wSXfpMi.png)

- **API Gateway:** Recebe requisições do cliente.
- **Lambda de validação:** Valida e processa dados iniciais, envia mensagens para a fila SQS e publica métricas no CloudWatch.
- **SQS:** Fila para processamento assíncrono.
- **Lambda worker:** Consome mensagens da SQS, processa dados, aciona a API pública do Datajud-Wiki e armazena os resultados no DynamoDB.
- **DynamoDB:** Persistência dos resultados processados.
- **CloudWatch:** Coleta métricas e logs das execuções.

## Tecnologias

- Node.js
- Serverless Framework
- AWS Lambda
- AWS SQS, DynamoDB
- Axios, JWT, AWS SDK

## Estrutura

- `src/api/` — Handlers das APIs.
- `src/services/` — Serviços de negócio e integração.
- `src/utils/` — Utilitários.
- `src/workers/` — Workers para processamento assíncrono.
- `tests/` — Testes automatizados de carga.

## Instalação

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Configure as variáveis de ambiente no AWS Secrets Manager ou `.env` local (ver `serverless.yml` para detalhes).

## Uso Local

Execute o backend localmente com o Serverless Offline:
```bash
serverless offline
```

## Deploy

O deploy é realizado manualmente via GitHub Actions:

1. Acesse o repositório no GitHub.
2. Vá até a aba "Actions" (ou "Ações").
3. Selecione o workflow de deploy (exemplo: `Deploy Backend`).
4. Clique em "Run workflow" ("Executar workflow") e siga as instruções para iniciar o deploy manualmente.

> O deploy direto via Serverless Framework (`serverless deploy --stage <stage>`) continua disponível como alternativa, caso prefira executar localmente.

O pipeline de deploy está configurado em `.github/workflows`.

## Testes

- **Testes de carga:**
  Para testes de carga, foi utilizado o [k6](https://k6.io/) do Grafana. O script utilizado está no arquivo `k6.js` e pode ser executado com:
  ```bash
  k6 run k6.js
  ```
  Consulte a documentação do k6 para mais detalhes sobre configuração e análise dos resultados.
