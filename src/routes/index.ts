import { Express } from 'express';
import fileRoutes from './fileRoutes';

const RoutesRegister = (app: Express): void => {
  app.use('/api/v1/file', fileRoutes);
};

export default RoutesRegister;
