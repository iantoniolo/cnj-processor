# CNJ Processor

Sistema completo para consulta, processamento e análise de dados do CNJ, composto por um backend serverless (Node.js/AWS) e um frontend moderno (Angular).

## Visão Geral

O projeto foi desenvolvido para facilitar a consulta de números CNJ, processando requisições de forma escalável e segura, utilizando recursos da AWS. A interface web permite a interação do usuário com o sistema de maneira simples e intuitiva.

## Estrutura do Projeto

- `backend/` — API, lógica de processamento, filas assíncronas e persistência (Node.js, Serverless Framework, AWS Lambda, SQS, DynamoDB).
- `frontend/` — Interface web para consulta e envio de dados (Angular 19).
- `.github/workflows/` — Pipeline de deploy automatizado via GitHub Actions.

## Principais Funcionalidades

- Consulta de números CNJ via interface web.
- Validação, processamento e integração com serviços externos.
- Deploy automatizado do backend via GitHub Actions.
- Arquitetura serverless, escalável e de baixo custo.

## Como começar

1. Leia os READMEs específicos em `backend/` e `frontend/` para instruções detalhadas de instalação, configuração e uso.

## Requisitos

- Node.js 18 ou superior
- Conta AWS (para uso do backend)
- Permissões para rodar workflows no GitHub (deploy backend)

## Deploy

- O deploy do backend é realizado manualmente via GitHub Actions (veja instruções em `backend/README.md`).
- O frontend pode ser publicado em qualquer serviço de hospedagem estática após o build (veja instruções em `frontend/README.md`).

---

## Arquitetura

A arquitetura do CNJ Processor é baseada em microsserviços serverless na AWS, garantindo alta escalabilidade, baixo custo e facilidade de manutenção. O fluxo principal é:

1. **Frontend Angular**: Interface web para o usuário consultar números CNJ.
2. **API Gateway**: Expõe os endpoints REST e faz a ponte entre o frontend e o backend.
3. **Lambda (cnjReceiver)**: Função responsável por validar, autenticar e encaminhar as requisições para processamento assíncrono.
4. **SQS**: Fila que desacopla o recebimento do CNJ do processamento.
5. **Lambda Processor**: Consome mensagens da fila, processa dados e armazena resultados.
6. **DynamoDB**: Banco NoSQL para persistência dos resultados das consultas.
7. **CloudWatch**: Monitoramento, métricas e logs de todas as funções e recursos.

![Diagrama de Arquitetura](./docs/images/architecture.png)
> Diagrama simplificado da arquitetura serverless do projeto CNJ Processor.

## Demonstrações e Métricas

### 1. Interface do Frontend - Consulta CNJ

![Consulta CNJ - Frontend](./docs/images/frontend_screen.png)
> Tela principal do frontend Angular hospedado no S3, onde o usuário pode informar o token de autenticação e o número CNJ para consulta. Após o envio, uma mensagem de sucesso é exibida indicando que o CNJ foi recebido e enviado para processamento assíncrono.

### 2. Teste do Endpoint via Postman

![Teste API - Postman](./docs/images/post_success.png)
> Exemplo de requisição POST para o endpoint `/cnj` usando o Postman. O corpo da requisição contém o número CNJ, e a resposta confirma o recebimento e o início do processamento.

### 3. Logs do Lambda - Recebimento e Processamento

![Logs Lambda - Receiver](./docs/images/receiver_logs.png)
![Logs Lambda - Processor](./docs/images/processor_logs.jpg)
> Logs do AWS Lambda mostrando o fluxo de recebimento da requisição, envio para a fila SQS e o processamento do CNJ. Essas informações auxiliam no monitoramento e troubleshooting do backend.

### 4. Consulta ao DynamoDB

![Consulta DynamoDB](./docs/images/dynamo_results.png)
> Visualização dos resultados armazenados no DynamoDB após o processamento. Cada item representa um CNJ consultado, incluindo o status e mensagem de resposta.

### 5. Métricas CloudWatch - Lambda

![CloudWatch Métricas - Receiver](./docs/images/receiver_metrics.png)
![CloudWatch Métricas - Processor](./docs/images/processor_metrics.png)
> Painéis do CloudWatch mostrando métricas de invocações, duração, erros e concorrência das funções Lambda responsáveis pelo processamento CNJ.

### 6. Testes de Carga com K6

![K6 Teste 1](./docs/images/one_per_hour.png)
![K6 Teste 2](./docs/images/hundred_per_minute.png)
> Execução de testes de carga utilizando o K6 para avaliar a performance e estabilidade do endpoint de processamento CNJ.
