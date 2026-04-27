# ---- Estágio de build ----
FROM node:20-alpine AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas os arquivos de dependências primeiro (cache de camadas)
COPY package*.json ./
COPY tsconfig.json ./

# Instala todas as dependências (incluindo devDependencies para o build)
RUN npm ci

# Copia o código fonte
COPY src ./src

# Compila o TypeScript para JavaScript
RUN npm run build

# ---- Estágio de produção ----
FROM node:20-alpine AS production

WORKDIR /app

# Copia apenas os arquivos necessários para produção
COPY package*.json ./

# Instala somente dependências de produção
RUN npm ci --only=production

# Copia o build gerado no estágio anterior
COPY --from=builder /app/dist ./dist

# Expõe a porta da aplicação
EXPOSE 3000

# Usuário não-root por segurança
USER node

# Comando para iniciar a aplicação
CMD ["node", "dist/server.js"]
