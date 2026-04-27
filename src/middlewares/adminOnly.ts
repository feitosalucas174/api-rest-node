import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

/**
 * Middleware de autorização por role.
 * Permite acesso apenas para usuários com o papel "admin".
 * Deve ser usado APÓS o middleware de autenticação (authenticate).
 */
export const adminOnly = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    // Verifica se o usuário foi autenticado e tem papel de admin
    if (!req.user || req.user.role !== 'admin') {
      throw new ApiError(403, 'Acesso negado. Apenas administradores podem acessar este recurso.');
    }

    next();
  } catch (error) {
    next(error);
  }
};
