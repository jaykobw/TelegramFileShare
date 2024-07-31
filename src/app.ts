import path from 'path';
import express from 'express';
import useHpp from './config/hpp';
import useCors from './config/cors';
import useMorgan from './config/morgan';
import useHelmet from './config/helmet';
import useRateLimiter from './config/ratelimiter';
import useCompression from './config/compression';
import RoutesRegister from './routes';
import './lib/Telegramlib';

const app = express();

app.use(express.static(path.join(__dirname, '..', '/public')));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

useRateLimiter(app);
useCompression(app);
useHelmet(app);
useMorgan(app);
useCors(app);
useHpp(app);

RoutesRegister(app);

export default app;
