# API de Gerenciamento de Pedidos

API REST desenvolvida em Node.js para gerenciamento de pedidos, utilizando Express, PostgreSQL e Prisma ORM.

## Tecnologias

- **Node.js**
- **Express**
- **PostgreSQL**
- **Prisma ORM**
- **JavaScript**

## Requisitos

- Node.js (versão 16 ou superior)
- PostgreSQL local (ou conta free no Supabase)
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

4. Execute as migrations do Prisma:

```bash
npx prisma migrate deploy
npx prisma generate
```

**Nota:** As migrations já estão criadas no projeto. O comando `migrate deploy` irá aplicá-las ao seu banco de dados.

## Como Executar

**IMPORTANTE:** Antes de executar, certifique-se de ter configurado o arquivo `.env` com suas credenciais do banco de dados e executado as migrations.

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

**GET** `/order/list`

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
curl http://localhost:3000/order/list
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
├── prisma/
│   └── schema.prisma          # Schema do banco de dados
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
│   │   └── prismaClient.js    # Cliente Prisma
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

```prisma
model Order {
  orderId      String   @id
  value        Float
  creationDate DateTime
  items        Item[]
}
```

### Item

```prisma
model Item {
  id        Int    @id @default(autoincrement())
  orderId   String
  productId Int
  quantity  Int
  price     Float
  order     Order  @relation(fields: [orderId], references: [orderId], onDelete: Cascade)
}
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

## Comandos Úteis

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Rodar em produção
npm start

# Visualizar banco de dados (Prisma Studio)
npx prisma studio

# Criar nova migration
npx prisma migrate dev --name nome_da_migration

# Gerar Prisma Client
npx prisma generate

# Resetar banco de dados
npx prisma migrate reset
```

---

Este projeto foi desenvolvido como parte de um teste técnico.

---
