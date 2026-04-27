import { z } from 'zod';

/**
 * Schema de validação para criação de produto.
 */
export const createProductSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'O nome do produto é obrigatório.' })
      .min(2, 'O nome deve ter pelo menos 2 caracteres.')
      .max(200, 'O nome deve ter no máximo 200 caracteres.')
      .trim(),
    description: z
      .string({ required_error: 'A descrição é obrigatória.' })
      .min(10, 'A descrição deve ter pelo menos 10 caracteres.')
      .max(1000, 'A descrição deve ter no máximo 1000 caracteres.')
      .trim(),
    price: z
      .number({ required_error: 'O preço é obrigatório.' })
      .min(0, 'O preço não pode ser negativo.'),
    category: z
      .string({ required_error: 'A categoria é obrigatória.' })
      .min(2, 'A categoria deve ter pelo menos 2 caracteres.')
      .trim(),
    stock: z
      .number()
      .int('O estoque deve ser um número inteiro.')
      .min(0, 'O estoque não pode ser negativo.')
      .default(0),
    active: z.boolean().default(true),
  }),
});

/**
 * Schema de validação para atualização de produto (todos os campos são opcionais).
 */
export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(200).trim().optional(),
    description: z.string().min(10).max(1000).trim().optional(),
    price: z.number().min(0).optional(),
    category: z.string().min(2).trim().optional(),
    stock: z.number().int().min(0).optional(),
    active: z.boolean().optional(),
  }),
});

// Tipos inferidos para uso nos controllers
export type CreateProductInput = z.infer<typeof createProductSchema>['body'];
export type UpdateProductInput = z.infer<typeof updateProductSchema>['body'];
