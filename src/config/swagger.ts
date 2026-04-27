import swaggerJsdoc from 'swagger-jsdoc';

/**
 * Opções de configuração do Swagger / OpenAPI 3.0.
 * Define metadados da API e os arquivos onde as anotações JSDoc estão.
 */
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API REST Node',
      version: '1.0.0',
      description:
        'API REST profissional desenvolvida por Dev Teste. Inclui autenticação JWT, CRUD de usuários e produtos, com segurança e documentação completa.',
      contact: {
        name: 'Dev Teste',
        email: 'feitosalucas174@gmail.com',
      },
    },
    servers: [
      {
        url: '/api',
        description: 'Servidor principal',
      },
    ],
    // Esquema de segurança para autenticação Bearer (JWT)
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insira o token JWT no formato: Bearer {token}',
        },
      },
      schemas: {
        // Schema de resposta padrão de sucesso
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operação realizada com sucesso.' },
            data: { type: 'object' },
          },
        },
        // Schema de resposta padrão de erro
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Mensagem de erro.' },
          },
        },
        // Schema de paginação
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            total: { type: 'integer', example: 50 },
            totalPages: { type: 'integer', example: 5 },
          },
        },
        // Schema do modelo de usuário
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '665f1a2b3c4d5e6f7a8b9c0d' },
            name: { type: 'string', example: 'Dev Teste' },
            email: { type: 'string', example: 'teste@email.com' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        // Schema do modelo de produto
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '665f1a2b3c4d5e6f7a8b9c0e' },
            name: { type: 'string', example: 'Notebook Dell XPS 15' },
            description: { type: 'string', example: 'Notebook profissional de alto desempenho.' },
            price: { type: 'number', example: 8999.99 },
            category: { type: 'string', example: 'Eletrônicos' },
            stock: { type: 'integer', example: 15 },
            active: { type: 'boolean', example: true },
            createdBy: { type: 'string', example: '665f1a2b3c4d5e6f7a8b9c0d' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  // Arquivos onde o Swagger vai buscar as anotações JSDoc
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
