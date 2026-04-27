import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { z } from 'zod';

// Schema de validação para atualização de usuário
const updateUserSchema = z.object({
  name: z.string().min(2).max(100).trim().optional(),
  email: z.string().email().toLowerCase().trim().optional(),
});

/**
 * GET /api/users
 * Lista todos os usuários com paginação (apenas admin).
 */
export const listUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Parâmetros de paginação com valores padrão
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;

    // Executa a consulta e a contagem em paralelo para melhor performance
    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      message: 'Usuários listados com sucesso.',
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/:id
 * Busca um usuário pelo ID.
 */
export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    // Usuário comum só pode ver o próprio perfil; admin pode ver qualquer um
    if (req.user?.role !== 'admin' && req.user?.id !== id) {
      throw new ApiError(403, 'Você não tem permissão para visualizar este usuário.');
    }

    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, 'Usuário não encontrado.');
    }

    res.status(200).json({
      success: true,
      message: 'Usuário encontrado.',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/:id
 * Atualiza os dados de um usuário.
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    // Usuário comum só pode editar o próprio perfil
    if (req.user?.role !== 'admin' && req.user?.id !== id) {
      throw new ApiError(403, 'Você não tem permissão para editar este usuário.');
    }

    // Valida os dados de entrada
    const validatedData = updateUserSchema.parse(req.body);

    // Se o e-mail está sendo alterado, verifica se já está em uso
    if (validatedData.email) {
      const emailInUse = await User.findOne({
        email: validatedData.email,
        _id: { $ne: id },
      });
      if (emailInUse) {
        throw new ApiError(409, 'Este e-mail já está em uso por outro usuário.');
      }
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: validatedData },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new ApiError(404, 'Usuário não encontrado.');
    }

    console.info(`[USER] Usuário atualizado: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Usuário atualizado com sucesso.',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/users/:id
 * Remove um usuário do sistema (apenas admin).
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    // Impede que o admin delete a si mesmo
    if (req.user?.id === id) {
      throw new ApiError(400, 'Você não pode deletar a sua própria conta.');
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new ApiError(404, 'Usuário não encontrado.');
    }

    console.warn(`[USER] Usuário deletado: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Usuário deletado com sucesso.',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
