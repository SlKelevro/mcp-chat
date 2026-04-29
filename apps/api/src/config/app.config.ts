import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  host: process.env.APP_HOST ?? '0.0.0.0',
  port: Number(process.env.APP_PORT ?? 3000),
  corsOrigin: process.env.APP_CORS_ORIGIN ?? 'http://localhost:5173',
}));
