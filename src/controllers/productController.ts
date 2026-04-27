import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product';
import { ApiError } from '../utils/ApiError';
import { createProductSchema, updateProductSchema } from '../validators/productValidator';

/**
 * GET /api/products
 * Lista todos os produtos com paginação e filtros.
 */
export const listProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Parâmetros de paginação
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;

    // Filtros opcionais por query string
    const filter: Record<string, unknown> = { active: true };

    if (req.query.category) {
      filter.category = { $regex: req.query.category as string, $options: 'i' };
    }

    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) (filter.price as Record<string, number>).$gte = parseFloat(req.query.minPrice as string);
      if (req.query.maxPrice) (filter.price as Record<string, number>).$lte = parseFloat(req.query.maxPrice as string);
    }

    // Busca por texto no nome ou descrição
    if (req.query.search) {
      filter.$text = { $search: req.query.search as string };
    }

    // Ordenação (padrão: mais recentes primeiro)
    const sortField = (req.query.sortBy as string) || 'createdAt';
    const sortOrder = req.query.order === 'asc' ? 1 : -1;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('createdBy', 'name email')
        .skip(skip)
        .limit(limit)
        .sort({ [sortField]: sortOrder }),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      message: 'Produtos listados com sucesso.',
      data: products,
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
 * GET /api/products/:id
 * Busca um produto pelo ID.
 */
export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).populate('createdBy', 'name email');

    if (!product) {
      throw new ApiError(404, 'Produto não encontrado.');
    }

    res.status(200).json({
      success: true,
      message: 'Produto encontrado.',
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/products
 * Cria um novo produto (requer autenticação).
 */
export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Valida os dados de entrada
    const { body } = createProductSchema.parse({ body: req.body });

    const product = await Product.create({
      ...body,
      createdBy: req.user?.id,
    });

    // Popula os dados do criador na resposta
    await product.populate('createdBy', 'name email');

    console.info(`[PRODUCT] Produto criado: ${product.name} por ${req.user?.id}`);

    res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso.',
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/products/:id
 * Atualiza um produto (requer autenticação).
 */
export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Valida os dados de entrada
    const { body } = updateProductSchema.parse({ body: req.body });

    const product = await Product.findById(req.params.id);
    if (!product) {
      throw new ApiError(404, 'Produto não encontrado.');
    }

    // Usuário comum só pode editar produtos que ele mesmo criou
    if (req.user?.role !== 'admin' && product.createdBy.toString() !== req.user?.id) {
      throw new ApiError(403, 'Você não tem permissão para editar este produto.');
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: body },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    console.info(`[PRODUCT] Produto atualizado: ${req.params.id}`);

    res.status(200).json({
      success: true,
      message: 'Produto atualizado com sucesso.',
      data: { product: updatedProduct },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/products/:id
 * Remove um produto (apenas admin).
 */
export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      throw new ApiError(404, 'Produto não encontrado.');
    }

    console.warn(`[PRODUCT] Produto deletado: ${product.name}`);

    res.status(200).json({
      success: true,
      message: 'Produto deletado com sucesso.',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
