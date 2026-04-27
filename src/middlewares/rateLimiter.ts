import rateLimit from 'express-rate-limit';

/**
 * Rate limiter geral para todas as rotas da API.
 * Limita a 100 requisições por IP a cada 15 minutos.
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: {
    success: false,
    message: 'Muitas requisições. Tente novamente em 15 minutos.',
  },
  standardHeaders: true, // Retorna os headers RateLimit-* no padrão RFC
  legacyHeaders: false,  // Desativa os headers X-RateLimit-* legados
});

/**
 * Rate limiter específico para rotas de autenticação.
 * Mais restritivo para prevenir ataques de força bruta.
 * Limita a 10 tentativas por IP a cada 15 minutos.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,
  message: {
    success: false,
    message: 'Muitas tentativas de autenticação. Tente novamente em 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
