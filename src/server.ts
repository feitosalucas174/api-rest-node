import 'dotenv/config';
import app from './app';
import { connectDatabase } from './config/database';

const PORT = parseInt(process.env.PORT || '3000', 10);

/**
 * Inicia o servidor após estabelecer a conexão com o banco de dados.
 */
const startServer = async (): Promise<void> => {
  try {
    // Conecta ao MongoDB antes de abrir a porta HTTP
    await connectDatabase();

    app.listen(PORT, () => {
      console.info(`[SERVER] Servidor rodando na porta ${PORT}`);
      console.info(`[SERVER] Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.info(`[SERVER] Documentação: http://localhost:${PORT}/api/docs`);
      console.info(`[SERVER] Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('[SERVER] Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
};

// Tratamento de erros não capturados para evitar que o processo caia silenciosamente
process.on('unhandledRejection', (reason) => {
  console.error('[SERVER] UnhandledRejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('[SERVER] UncaughtException:', error);
  process.exit(1);
});

startServer();
