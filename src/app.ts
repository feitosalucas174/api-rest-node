import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { generalLimiter } from './middlewares/rateLimiter';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';

// Cria a instância principal do Express
const app = express();

// ============================================================
// Middlewares de segurança
// ============================================================

// Helmet: define headers HTTP de segurança
app.use(helmet());

// CORS: controla as origens permitidas para acessar a API
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ============================================================
// Middlewares de parsing
// ============================================================

// Interpreta o corpo das requisições como JSON
app.use(express.json({ limit: '10mb' }));
// Interpreta dados de formulários URL-encoded
app.use(express.urlencoded({ extended: true }));

// ============================================================
// Rate Limiting geral
// ============================================================

app.use('/api', generalLimiter);

// ============================================================
// Documentação Swagger
// ============================================================

app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'API REST Node — Documentação',
    customCss: '.swagger-ui .topbar { background-color: #1a1a2e; }',
  })
);

// ============================================================
// Rotas da API
// ============================================================

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Health Check — verifica o status da API e do banco de dados
app.get('/api/health', (_req, res) => {
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  res.status(200).json({
    success: true,
    message: 'API funcionando corretamente.',
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: dbStatus,
      version: '1.0.0',
    },
  });
});

// Rota base para verificação rápida
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'API REST Node — em funcionamento. Acesse /api/docs para a documentação.',
  });
});

// Rota 404 — para caminhos não encontrados
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada.',
  });
});

// ============================================================
// Middleware global de tratamento de erros (deve ser o último)
// ============================================================

app.use(errorHandler);

export default app;
