import { z } from 'zod';

/**
 * Schema de validação para o registro de novo usuário.
 */
export const registerSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'O nome é obrigatório.' })
      .min(2, 'O nome deve ter pelo menos 2 caracteres.')
      .max(100, 'O nome deve ter no máximo 100 caracteres.')
      .trim(),
    email: z
      .string({ required_error: 'O e-mail é obrigatório.' })
      .email('Formato de e-mail inválido.')
      .toLowerCase()
      .trim(),
    password: z
      .string({ required_error: 'A senha é obrigatória.' })
      .min(6, 'A senha deve ter pelo menos 6 caracteres.')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número.'
      ),
  }),
});

/**
 * Schema de validação para o login do usuário.
 */
export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'O e-mail é obrigatório.' })
      .email('Formato de e-mail inválido.')
      .toLowerCase()
      .trim(),
    password: z
      .string({ required_error: 'A senha é obrigatória.' })
      .min(1, 'A senha é obrigatória.'),
  }),
});

/**
 * Schema de validação para renovação de token.
 */
export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z
      .string({ required_error: 'O refresh token é obrigatório.' })
      .min(1, 'O refresh token é obrigatório.'),
  }),
});

// Tipos inferidos dos schemas para uso nos controllers
export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type RefreshInput = z.infer<typeof refreshSchema>['body'];
