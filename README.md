## Task Manager - Frontend

Front-end em Vue.js para as APIs de Tasks (PHP, Node, Python ou Java Spring Boot).

## Requisitos de ambiente

Para rodar localmente:

- Node (v.18 ou superior) e npm (v.9 ou superior)
- Docker e Docker Compose (para execução containerizada)

## Instalação e configuração (local)

Após clonar o repositório e entrar na pasta do projeto:

- Instale as dependências:
```
npm install
```

- Crie o arquivo `.env` a partir do exemplo:
```
cp .env.dist .env
```

- Defina o endereço do backend no `.env`. Exemplo:
```
VITE_SERVER_HOST=http://localhost:8080
```

- Inicie o front-end (porta 3005):
```
npm start
```

## Execução com Docker

O `VITE_SERVER_HOST` é o URL do backend visto pelo **navegador** (não pelo container). Se a API estiver em `localhost:8080` na sua máquina, esse valor continua correto.

```
cp .env.dist .env
docker compose up --build
```

A aplicação fica disponível em [http://localhost:3005](http://localhost:3005).

Para apontar para outro backend no build:
```
VITE_SERVER_HOST=http://localhost:8080 docker compose up --build
```

Para usar outra porta no host:
```
FRONTEND_PORT=8081 docker compose up --build
```
