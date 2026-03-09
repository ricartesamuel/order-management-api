# API de Gerenciamento de Pedidos

API REST desenvolvida em Node.js para gerenciamento de pedidos, utilizando Express e PostgreSQL.

## Tecnologias

- **Node.js**
- **Express**
- **PostgreSQL**
- **pg** (PostgreSQL driver)
- **JavaScript**

## Requisitos

- Node.js (versão 16 ou superior)
- PostgreSQL (local ou Supabase)
- npm ou yarn

## Instalação

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
cd order-management-api
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

Copie o arquivo `.env.example` para `.env` e configure suas credenciais:

```bash
copy .env.example .env
```

Edite o arquivo `.env` com suas credenciais reais:

```env
PORT=3000
DATABASE_URL="postgresql://usuario:senha@host:5432/nome_do_banco"
```

**Exemplo com Supabase:**

```env
PORT=3000
DATABASE_URL="postgresql://postgres.xxxxx:sua-senha@aws-0-us-west-2.pooler.supabase.com:5432/postgres"
```

4. Crie as tabelas no banco de dados:

Execute o seguinte SQL no seu banco PostgreSQL:

```sql
CREATE TABLE IF NOT EXISTS "Order" (
  "orderId" TEXT PRIMARY KEY,
  "value" DOUBLE PRECISION NOT NULL,
  "creationDate" TIMESTAMP(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS "Items" (
  "id" SERIAL PRIMARY KEY,
  "orderId" TEXT NOT NULL,
  "productId" INTEGER NOT NULL,
  "quantity" INTEGER NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  CONSTRAINT "Items_orderId_fkey" FOREIGN KEY ("orderId")
    REFERENCES "Order"("orderId") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "Items_orderId_idx" ON "Items"("orderId");
```

## Como Executar

**IMPORTANTE:** Antes de executar, certifique-se de ter configurado o arquivo `.env` com suas credenciais do banco de dados e criado as tabelas.

### Desenvolvimento (com hot-reload):

```bash
npm run dev
```

### Modo Produção:

```bash
npm start
```

A API estará disponível em: `http://localhost:3000`

## Documentação

### Base URL

```
http://localhost:3000
```

### Endpoints Disponíveis

#### 1. Criar Pedido

**POST** `/order`

Cria um novo pedido no sistema.

**Request Body:**

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
```

**Response:** `201 Created`

```json
{
  "orderId": "v10089015vdb",
  "value": 10000,
  "creationDate": "2023-07-19T12:24:11.529Z",
  "items": [
    {
      "id": 1,
      "orderId": "v10089015vdb",
      "productId": 2434,
      "quantity": 1,
      "price": 1000
    }
  ]
}
```

**Exemplo com cURL:**

```bash
curl -X POST http://localhost:3000/order \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

---

#### 2. Buscar Pedido por ID

**GET** `/order/:orderId`

Retorna os detalhes de um pedido específico.

**Response:** `200 OK`

```json
{
  "orderId": "v10089015vdb",
  "value": 10000,
  "creationDate": "2023-07-19T12:24:11.529Z",
  "items": [
    {
      "id": 1,
      "orderId": "v10089015vdb",
      "productId": 2434,
      "quantity": 1,
      "price": 1000
    }
  ]
}
```

**Exemplo com cURL:**

```bash
curl http://localhost:3000/order/v10089015vdb
```

---

#### 3. Listar Todos os Pedidos

**GET** `/order`

Retorna a lista de todos os pedidos cadastrados.

**Response:** `200 OK`

```json
[
  {
    "orderId": "v10089015vdb",
    "value": 10000,
    "creationDate": "2023-07-19T12:24:11.529Z",
    "items": [
      {
        "id": 1,
        "orderId": "v10089015vdb",
        "productId": 2434,
        "quantity": 1,
        "price": 1000
      }
    ]
  }
]
```

**Exemplo com cURL:**

```bash
curl http://localhost:3000/order
```

---

#### 4. Atualizar Pedido

**PUT** `/order/:orderId`

Atualiza um pedido existente. Os items são completamente substituídos.

**Request Body:**

```json
{
  "numeroPedido": "v10089015vdb-02",
  "valorTotal": 15000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 2,
      "valorItem": 1500
    }
  ]
}
```

**Response:** `200 OK`

```json
{
  "orderId": "v10089015vdb",
  "value": 15000,
  "creationDate": "2023-07-19T12:24:11.529Z",
  "items": [
    {
      "id": 2,
      "orderId": "v10089015vdb",
      "productId": 2434,
      "quantity": 2,
      "price": 1500
    }
  ]
}
```

**Exemplo com cURL:**

```bash
curl -X PUT http://localhost:3000/order/v10089015vdb \
  -H "Content-Type: application/json" \
  -d '{
    "numeroPedido": "v10089015vdb-02",
    "valorTotal": 15000,
    "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
    "items": [
      {
        "idItem": "2434",
        "quantidadeItem": 2,
        "valorItem": 1500
      }
    ]
  }'
```

---

#### 5. Deletar Pedido

**DELETE** `/order/:orderId`

Remove um pedido do sistema. Os items são removidos automaticamente (cascade).

**Response:** `204 No Content`

**Exemplo com cURL:**

```bash
curl -X DELETE http://localhost:3000/order/v10089015vdb
```

---

## 🔄 Transformação de Dados

A API realiza transformação automática dos dados recebidos:

### Mapeamento de Campos

| Campo da API           | Campo no Banco | Transformação          |
| ---------------------- | -------------- | ---------------------- |
| `numeroPedido`         | `orderId`      | Remove sufixo após "-" |
| `valorTotal`           | `value`        | Direto                 |
| `dataCriacao`          | `creationDate` | Converte para Date     |
| `items.idItem`         | `productId`    | Converte para Int      |
| `items.quantidadeItem` | `quantity`     | Direto                 |
| `items.valorItem`      | `price`        | Direto                 |

### Exemplo de Transformação

**Entrada:**

```json
{
  "numeroPedido": "v10089015vdb-01"
}
```

**Banco de Dados:**

```json
{
  "orderId": "v10089015vdb"
}
```

O sufixo `-01` é automaticamente removido.

---

## Error-handling

A API retorna erros no seguinte formato:

```json
{
  "error": {
    "message": "Descrição do erro",
    "status": 400
  }
}
```

### Exemplos de Erros

**Validação (400):**

```json
{
  "error": {
    "message": "numeroPedido é obrigatório, valorTotal deve ser maior que 0",
    "status": 400
  }
}
```

**Não encontrado (404):**

```json
{
  "error": {
    "message": "Pedido não encontrado",
    "status": 404
  }
}
```

---

## Estrutura do Projeto

```
order-management-api/
│
├── src/
│   ├── controllers/
│   │   └── orderController.js # Controladores HTTP
│   │
│   ├── services/
│   │   └── orderService.js    # Lógica de negócio
│   │
│   ├── routes/
│   │   └── orderRoutes.js     # Definição de rotas
│   │
│   ├── database/
│   │   └── pgClient.js        # Cliente PostgreSQL
│   │
│   └── app.js                 # Configuração do Express
│
├── .env                       # Variáveis de ambiente
├── .gitignore
├── package.json
└── README.md
```

---

## Modelo de Dados

### Order (Pedido)

```sql
CREATE TABLE "Order" (
  "orderId" TEXT PRIMARY KEY,
  "value" DOUBLE PRECISION NOT NULL,
  "creationDate" TIMESTAMP(3) NOT NULL
);
```

### Items

```sql
CREATE TABLE "Items" (
  "id" SERIAL PRIMARY KEY,
  "orderId" TEXT NOT NULL,
  "productId" INTEGER NOT NULL,
  "quantity" INTEGER NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  FOREIGN KEY ("orderId") REFERENCES "Order"("orderId") ON DELETE CASCADE
);
```

---

## Testando a API

### Usando Postman ou Insomnia

1. Importe a collection ou crie as requisições manualmente
2. Configure a base URL: `http://localhost:3000`
3. Teste cada endpoint seguindo os exemplos acima

### Usando cURL (linha de comando)

Todos os exemplos de cURL estão disponíveis na seção de documentação de cada endpoint.

---

Este projeto foi desenvolvido como parte de um teste técnico.
