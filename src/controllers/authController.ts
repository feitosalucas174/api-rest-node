import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/generateToken';
import { registerSchema, loginSchema, refreshSchema } from '../validators/authValidator';

/**
 * POST /api/auth/register
 * Cadastra um novo usuário na plataforma.
 */
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Valida os dados de entrada com Zod
    const { body } = registerSchema.parse({ body: req.body });

    // Verifica se o e-mail já está cadastrado
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      throw new ApiError(409, 'Este e-mail já está em uso.');
    }

    // Cria o usuário (senha será hasheada automaticamente pelo hook do Mongoose)
    const user = await User.create({
      name: body.name,
      email: body.email,
      password: body.password,
    });

    // Gera os tokens de acesso
    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id, role: user.role });

    console.info(`[AUTH] Novo usuário registrado: ${user.email}`);

    res.status(201).json({
      success: true,
      message: 'Usuário cadastrado com sucesso.',
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Autentica o usuário e retorna o token JWT.
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Valida os dados de entrada
    const { body } = loginSchema.parse({ body: req.body });

    // Busca o usuário incluindo a senha (campo oculto por padrão)
    const user = await User.findOne({ email: body.email }).select('+password');
    if (!user) {
      // Mensagem genérica para não revelar se o e-mail existe
      throw new ApiError(401, 'E-mail ou senha inválidos.');
    }

    // Compara a senha informada com o hash salvo
    const isPasswordValid = await user.comparePassword(body.password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'E-mail ou senha inválidos.');
    }

    // Gera os tokens de acesso
    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id, role: user.role });

    console.info(`[AUTH] Login realizado: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso.',
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/refresh
 * Renova o access token usando um refresh token válido.
 */
export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Valida os dados de entrada
    const { body } = refreshSchema.parse({ body: req.body });

    // Verifica o refresh token
    const decoded = verifyRefreshToken(body.refreshToken);
    if (!decoded) {
      throw new ApiError(401, 'Refresh token inválido ou expirado.');
    }

    // Verifica se o usuário ainda existe no banco
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(401, 'Usuário não encontrado.');
    }

    // Gera novos tokens
    const newAccessToken = generateAccessToken({ id: user.id, role: user.role });
    const newRefreshToken = generateRefreshToken({ id: user.id, role: user.role });

    res.status(200).json({
      success: true,
      message: 'Token renovado com sucesso.',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Retorna os dados do usuário autenticado.
 */
export const me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // req.user foi adicionado pelo middleware de autenticação
    const user = await User.findById(req.user?.id);
    if (!user) {
      throw new ApiError(404, 'Usuário não encontrado.');
    }

    res.status(200).json({
      success: true,
      message: 'Dados do usuário obtidos com sucesso.',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
