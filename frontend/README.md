# Frontend — CNJ Processor

Interface web desenvolvida em Angular para interação com o sistema CNJ Processor.

## Demonstração Visual

![Interface do Frontend](https://imgur.com/aaffHM8.png)
> Tela principal do frontend Angular, onde o usuário pode informar o token de autenticação e o número CNJ para consulta.

## Tecnologias

- Angular 19+
- Typescript

## Estrutura

- `src/app/` — Componentes, serviços e módulos da aplicação.
- `src/environments/` — Configurações de ambiente.

## Instalação

1. Instale as dependências:
   ```bash
   npm install
   ```

## Desenvolvimento

Para rodar localmente:
```bash
npm start
```
Acesse [http://localhost:4200](http://localhost:4200).

## Testes

- Unitários:
  ```bash
  ng test
  ```

## Build

Para gerar build de produção:
```bash
ng build --configuration production
```

## Testes

Para rodar os testes unitários:
```bash
ng test
```

## Personalização

- Para alterar endpoints ou variáveis de ambiente, edite os arquivos em `src/environments/`.
- O formulário pode ser customizado em `src/app/form/`.

## Requisitos

- Node.js 18+
- Angular CLI 19+

