import mongoose from 'mongoose';

/**
 * Estabelece a conexão com o banco de dados MongoDB.
 * Registra eventos de conexão para monitoramento.
 */
export const connectDatabase = async (): Promise<void> => {
  const uri = process.env.MONGO_URI as string;

  if (!uri) {
    console.error('[DB] MONGO_URI não definida nas variáveis de ambiente.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.info('[DB] Conectado ao MongoDB com sucesso.');
  } catch (error) {
    console.error('[DB] Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }

  // Evento disparado quando a conexão é encerrada
  mongoose.connection.on('disconnected', () => {
    console.warn('[DB] Desconectado do MongoDB.');
  });

  // Evento disparado em caso de erro após a conexão inicial
  mongoose.connection.on('error', (error) => {
    console.error('[DB] Erro na conexão com MongoDB:', error);
  });
};
