# Jitterbit Order API

API desenvolvida em Node.js para gerenciamento de pedidos.

## Tecnologias utilizadas

- Node.js
- Express
- MySQL

## Como rodar o projeto

1. Instalar dependências

npm install

2. Rodar o servidor

node index.js

A API irá rodar em:

http://localhost:3000

## Endpoints

### Criar pedido

POST /order

### Buscar pedido

GET /order/:id

### Listar pedidos

GET /order/list

### Deletar pedido

DELETE /order/:id

## Exemplo de JSON

```json
{
"numeroPedido": "v10089015vdb-01",
"valorTotal": 10000,
"dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
"items": [
{
"idItem": "2434",
"quantidadeItem": 1,
"valorItem": 1000
}
]
}
