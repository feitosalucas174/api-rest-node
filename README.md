# api-rest-node

![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248?logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)

API REST profissional desenvolvida por **Dev Teste** com Node.js, Express, TypeScript e MongoDB. Inclui autenticação JWT, CRUD completo, documentação Swagger e suporte a Docker.

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js 20 |
| Linguagem | TypeScript 5 (strict) |
| Framework | Express 4 |
| Banco de dados | MongoDB 7 + Mongoose 8 |
| Autenticação | JWT (jsonwebtoken) |
| Hash de senha | bcryptjs |
| Validação | Zod |
| Segurança | Helmet + CORS + express-rate-limit |
| Documentação | Swagger (swagger-jsdoc + swagger-ui-express) |
| Containers | Docker + docker-compose |

---

## Como rodar localmente

### Pré-requisitos

- Node.js 20+
- MongoDB rodando localmente (ou use o Docker)
- npm

### 1. Sem Docker

```bash
# Clone o repositório
git clone https://github.com/feitosalucas174/api-rest-node.git
cd api-rest-node

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações

# Popule o banco com dados iniciais (opcional)
npm run seed

# Inicie em modo desenvolvimento
npm run dev
```

A API estará disponível em: `http://localhost:3000`

### 2. Com Docker

```bash
# Clone o repositório
git clone https://github.com/feitosalucas174/api-rest-node.git
cd api-rest-node

# Suba os containers (app + MongoDB)
docker-compose up -d

# Verifique os logs
docker-compose logs -f app
```

A API estará disponível em: `http://localhost:3000`  
O MongoDB estará disponível em: `mongodb://localhost:27017`

### 3. Build de produção

```bash
npm run build
npm start
```

---

## Rotas da API

### Autenticação

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Cadastrar novo usuário | Não |
| POST | `/api/auth/login` | Fazer login | Não |
| POST | `/api/auth/refresh` | Renovar access token | Não |
| GET | `/api/auth/me` | Dados do usuário logado | JWT |

### Usuários

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/api/users` | Listar todos os usuários | JWT + Admin |
| GET | `/api/users/:id` | Buscar usuário por ID | JWT |
| PUT | `/api/users/:id` | Atualizar usuário | JWT |
| DELETE | `/api/users/:id` | Deletar usuário | JWT + Admin |

### Produtos

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/api/products` | Listar produtos (paginação + filtros) | Não |
| GET | `/api/products/:id` | Buscar produto por ID | Não |
| POST | `/api/products` | Criar produto | JWT |
| PUT | `/api/products/:id` | Atualizar produto | JWT |
| DELETE | `/api/products/:id` | Deletar produto | JWT + Admin |

### Utilitários

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/health` | Status da API e banco de dados |
| GET | `/api/docs` | Documentação Swagger UI |

---

## Filtros disponíveis em `GET /api/products`

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `page` | integer | Número da página (padrão: 1) |
| `limit` | integer | Itens por página (padrão: 10, máx: 100) |
| `category` | string | Filtrar por categoria |
| `minPrice` | number | Preço mínimo |
| `maxPrice` | number | Preço máximo |
| `search` | string | Busca por texto (nome/descrição) |
| `sortBy` | string | Campo para ordenar (padrão: createdAt) |
| `order` | string | `asc` ou `desc` (padrão: desc) |

---

## Exemplos com curl

### Registrar usuário
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Dev Teste","email":"teste@email.com","password":"Senha@123"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@email.com","password":"Admin@123"}'
```

### Listar produtos
```bash
curl "http://localhost:3000/api/products?page=1&limit=5&category=Eletronicos"
```

### Criar produto (autenticado)
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{"name":"Produto Novo","description":"Descricao do produto de exemplo.","price":299.90,"category":"Geral","stock":100}'
```

### Renovar token
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"SEU_REFRESH_TOKEN"}'
```

### Health check
```bash
curl http://localhost:3000/api/health
```

---

## Padrao de resposta

Todas as respostas seguem o mesmo formato:

```json
{
  "success": true,
  "message": "Descricao da operacao.",
  "data": {},
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

## Variaveis de ambiente

Copie o `.env.example` para `.env` e configure:

| Variavel | Descricao | Padrao |
|---|---|---|
| `PORT` | Porta da aplicacao | `3000` |
| `MONGO_URI` | URI de conexao MongoDB | `mongodb://localhost:27017/api-rest` |
| `JWT_SECRET` | Secret do access token | — |
| `JWT_EXPIRES_IN` | Expiracao do access token | `7d` |
| `JWT_REFRESH_SECRET` | Secret do refresh token | — |
| `JWT_REFRESH_EXPIRES_IN` | Expiracao do refresh token | `30d` |
| `NODE_ENV` | Ambiente (`development`/`production`) | `development` |

---

## Scripts disponiveis

```bash
npm run dev      # Inicia em desenvolvimento com hot-reload (ts-node-dev)
npm run build    # Compila TypeScript para JavaScript (pasta /dist)
npm start        # Inicia o build de producao
npm run seed     # Popula o banco com dados iniciais
npm run lint     # Executa o ESLint nos arquivos TypeScript
```

---

## Seed de dados

O script `npm run seed` cria:

- **Usuario admin:** `admin@email.com` / `Admin@123`
- **Usuario comum:** `user@email.com` / `User@123`
- **5 produtos** de exemplo nas categorias: Eletronicos, Perifericos, Monitores e Audio

---

## Deploy no Render.com

1. Faca o fork/push do projeto para o GitHub
2. Acesse [render.com](https://render.com) e crie uma nova **Web Service**
3. Conecte seu repositorio GitHub
4. Configure:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment:** Node
5. Adicione as variaveis de ambiente na aba **Environment**:
   - `MONGO_URI` — use o [MongoDB Atlas](https://www.mongodb.com/atlas) para o banco em nuvem
   - `JWT_SECRET` — um valor aleatorio e seguro
   - `JWT_REFRESH_SECRET` — outro valor aleatorio e seguro
   - `NODE_ENV` = `production`
6. Clique em **Create Web Service**

O Render detectara automaticamente as mudancas no repositorio e fara o deploy.

---

## Documentacao interativa

Com a API rodando, acesse:

```
http://localhost:3000/api/docs
```

A documentacao Swagger UI permite testar todos os endpoints diretamente pelo navegador. Para rotas protegidas, clique em **Authorize** e insira `Bearer SEU_TOKEN_JWT`.

---

## Licenca

MIT — veja o arquivo [LICENSE](LICENSE) para detalhes.
