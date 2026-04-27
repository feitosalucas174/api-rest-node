import { Router } from 'express';
import {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { authenticate } from '../middlewares/auth';
import { adminOnly } from '../middlewares/adminOnly';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gerenciamento de produtos
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Listar todos os produtos (com paginação e filtros)
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: Filtrar por categoria
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *         description: Preço mínimo
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *         description: Preço máximo
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Busca por texto no nome/descrição
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, default: createdAt }
 *         description: Campo para ordenação
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc], default: desc }
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 */
router.get('/', listProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Buscar produto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto encontrado
 *       404:
 *         description: Produto não encontrado
 */
router.get('/:id', getProductById);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Criar novo produto
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, price, category]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Notebook Dell XPS 15
 *               description:
 *                 type: string
 *                 example: Notebook profissional de alto desempenho com Intel Core i9.
 *               price:
 *                 type: number
 *                 example: 8999.99
 *               category:
 *                 type: string
 *                 example: Eletrônicos
 *               stock:
 *                 type: integer
 *                 example: 15
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 */
router.post('/', authenticate, createProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Atualizar produto
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               category: { type: string }
 *               stock: { type: integer }
 *               active: { type: boolean }
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Produto não encontrado
 */
router.put('/:id', authenticate, updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Deletar produto (admin)
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto deletado com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão de admin
 *       404:
 *         description: Produto não encontrado
 */
router.delete('/:id', authenticate, adminOnly, deleteProduct);

export default router;
