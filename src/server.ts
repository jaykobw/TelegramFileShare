import dotenv from 'dotenv';
import logger from './util/Logger';
import app from './app';
import initializeDBConnection from './config/database/db.config';

process.on('uncaughtException', (err: any) => {
  logger.info('UNCAUGHT EXCEPTION!');
  logger.info(err.message);
  process.exit(1);
});

dotenv.config({
  path: './.env',
});

initializeDBConnection();

const SERVER_PORT = process.env.APP_PORT || 3000;

const server = app.listen(SERVER_PORT, () => {
  logger.info(`App is running on PORT: ${SERVER_PORT}`);
});

process.on('unhandledRejection', (err: any) => {
  logger.info('UNHANDLED REJECTION! Shutting down...');
  logger.info(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM RECEIVED. Shutting down');
  server.close(() => {
    logger.info('Process terminated!');
  });
});
