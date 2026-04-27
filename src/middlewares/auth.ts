import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/generateToken';
import { ApiError } from '../utils/ApiError';

/**
 * Estende a interface Request do Express para incluir o usuário autenticado.
 */
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Middleware de autenticação JWT.
 * Valida o token Bearer no header Authorization antes de permitir acesso às rotas protegidas.
 */
export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    // Verifica se o header Authorization foi fornecido
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Token de autenticação não fornecido.');
    }

    // Extrai o token do header (formato: "Bearer <token>")
    const token = authHeader.split(' ')[1];

    // Verifica e decodifica o token
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      throw new ApiError(401, 'Token inválido ou expirado.');
    }

    // Adiciona os dados do usuário ao objeto de requisição
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};
