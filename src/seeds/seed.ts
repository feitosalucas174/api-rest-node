/**
 * Script de seed para popular o banco de dados com dados iniciais.
 * Execução: npm run seed
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Product } from '../models/Product';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/api-rest';

// Dados dos usuários iniciais
const users = [
  {
    name: 'Administrador',
    email: 'admin@email.com',
    password: 'Admin@123',
    role: 'admin' as const,
  },
  {
    name: 'Usuário Padrão',
    email: 'user@email.com',
    password: 'User@123',
    role: 'user' as const,
  },
];

// Dados dos produtos de exemplo
const getProducts = (adminId: mongoose.Types.ObjectId) => [
  {
    name: 'Notebook Dell XPS 15',
    description: 'Notebook profissional com Intel Core i9, 32GB RAM e SSD 1TB. Ideal para desenvolvimento e design.',
    price: 8999.99,
    category: 'Eletrônicos',
    stock: 15,
    active: true,
    createdBy: adminId,
  },
  {
    name: 'Mouse Logitech MX Master 3',
    description: 'Mouse ergonômico sem fio com scroll eletromagnético e conectividade para múltiplos dispositivos.',
    price: 549.90,
    category: 'Periféricos',
    stock: 50,
    active: true,
    createdBy: adminId,
  },
  {
    name: 'Teclado Mecânico Keychron K2',
    description: 'Teclado mecânico compacto 75% com switches Gateron Red, retroiluminação RGB e conexão Bluetooth.',
    price: 799.00,
    category: 'Periféricos',
    stock: 30,
    active: true,
    createdBy: adminId,
  },
  {
    name: 'Monitor LG UltraWide 34"',
    description: 'Monitor UltraWide curvo 34 polegadas, resolução UWQHD 3440x1440, 144Hz e suporte HDR.',
    price: 3299.00,
    category: 'Monitores',
    stock: 8,
    active: true,
    createdBy: adminId,
  },
  {
    name: 'Headset Sony WH-1000XM5',
    description: 'Fone de ouvido over-ear com cancelamento de ruído líder de mercado, 30h de bateria e qualidade de som premium.',
    price: 1899.90,
    category: 'Áudio',
    stock: 25,
    active: true,
    createdBy: adminId,
  },
];

/**
 * Função principal do seed.
 */
const runSeed = async (): Promise<void> => {
  try {
    console.info('[SEED] Conectando ao MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.info('[SEED] Conectado com sucesso.');

    // Limpa as coleções antes de inserir os dados
    console.info('[SEED] Limpando coleções existentes...');
    await User.deleteMany({});
    await Product.deleteMany({});

    // Cria os usuários
    console.info('[SEED] Criando usuários...');
    const createdUsers = await User.insertMany(users);

    // Busca o admin pelo e-mail para associar os produtos
    const admin = createdUsers.find((u) => u.email === 'admin@email.com');
    if (!admin) throw new Error('Admin não encontrado após a inserção.');

    // Cria os produtos associados ao admin
    console.info('[SEED] Criando produtos...');
    await Product.insertMany(getProducts(admin._id as mongoose.Types.ObjectId));

    console.info('\n[SEED] ✅ Seed concluído com sucesso!\n');
    console.info('Usuários criados:');
    console.info('  - admin@email.com / Admin@123 (role: admin)');
    console.info('  - user@email.com  / User@123  (role: user)');
    console.info('\n5 produtos de exemplo inseridos.');
    console.info('\nDocumentação: http://localhost:3000/api/docs');
  } catch (error) {
    console.error('[SEED] Erro ao executar o seed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.info('[SEED] Conexão encerrada.');
    process.exit(0);
  }
};

runSeed();
