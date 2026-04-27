import jwt from 'jsonwebtoken';

/**
 * Interface dos dados que serão incluídos no payload do token JWT.
 */
export interface TokenPayload {
  id: string;
  role: string;
}

/**
 * Gera um access token JWT para o usuário.
 * @param payload - Dados do usuário (id e role)
 * @returns String com o token JWT assinado
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET as string;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

/**
 * Gera um refresh token JWT de longa duração.
 * @param payload - Dados do usuário (id e role)
 * @returns String com o refresh token JWT assinado
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_REFRESH_SECRET as string;
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

/**
 * Verifica e decodifica um access token JWT.
 * @param token - Token JWT a ser verificado
 * @returns Payload decodificado ou null se inválido
 */
export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
};

/**
 * Verifica e decodifica um refresh token JWT.
 * @param token - Refresh token a ser verificado
 * @returns Payload decodificado ou null se inválido
 */
export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    const secret = process.env.JWT_REFRESH_SECRET as string;
    const decoded = jwt.verify(token, secret) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
};
