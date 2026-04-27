import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { ZodError } from 'zod';
import mongoose from 'mongoose';

/**
 * Middleware global de tratamento de erros.
 * Captura todos os erros lançados na aplicação e retorna respostas padronizadas.
 * Deve ser o ÚLTIMO middleware registrado no Express.
 */
export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('[ERROR]', error.message);

  // Erros de validação do Zod (dados inválidos na requisição)
  if (error instanceof ZodError) {
    const messages = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    res.status(400).json({
      success: false,
      message: `Erro de validação: ${messages}`,
    });
    return;
  }

  // Erros operacionais da API (lançados com ApiError)
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  // Erro de ID inválido do Mongoose (CastError)
  if (error instanceof mongoose.Error.CastError) {
    res.status(400).json({
      success: false,
      message: 'ID inválido fornecido.',
    });
    return;
  }

  // Erro de chave duplicada no MongoDB (ex: e-mail já cadastrado)
  if ((error as NodeJS.ErrnoException).name === 'MongoServerError') {
    const mongoError = error as Error & { code?: number; keyValue?: Record<string, unknown> };
    if (mongoError.code === 11000) {
      const field = Object.keys(mongoError.keyValue || {}).join(', ');
      res.status(409).json({
        success: false,
        message: `O campo "${field}" já está em uso.`,
      });
      return;
    }
  }

  // Erro de validação do Mongoose
  if (error instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(error.errors).map((e) => e.message).join(', ');
    res.status(400).json({
      success: false,
      message: `Erro de validação: ${messages}`,
    });
    return;
  }

  // Erro interno do servidor (não operacional / inesperado)
  console.error('[ERRO CRÍTICO]', error.stack);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor. Tente novamente mais tarde.',
  });
};
