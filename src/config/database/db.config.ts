import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import logger from '../../util/Logger';
import dbConfig from './config.json';

dotenv.config({
  path: './.env',
});

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env as keyof typeof dbConfig];

const DB_HOST = process.env.DB_HOST || config.host;
const DB_NAME = (process.env.DB_DATABASE as string) || config.database;
const DB_USERNAME = (process.env.DB_USERNAME as string) || config.username;
const DB_PASSWORD = process.env.DB_PASSWORD || `${config.password}`;
const DB_PORT = Number(process.env.DB_PORT) || config.port;

const useSequelizeConnection = new Sequelize({
  dialect: 'postgres',
  host: DB_HOST,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
  logging:
    process.env.NODE_ENV === 'development' ? (msg) => logger.debug(msg) : false,
  models: [__dirname + '/models'],
  dialectOptions: {},
  timezone: '+03:00',
});

const initializeDBConnection = async () => {
  try {
    await useSequelizeConnection.sync({ force: true });
    logger.info('Database connected succesfully!');
  } catch (e) {
    logger.info(`Failed to sync database connection with error : ${e}`);
  }
};

export default initializeDBConnection;
