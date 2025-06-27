import 'reflect-metadata';

import express, { Application } from 'express';

import { loadProjectFiles } from '../kernel/di/load';

import { cors } from './utils/cors';

const app: Application = express();

async function bootstrap() {
  await loadProjectFiles(); // 🔁 Carrega todos os arquivos e ativa os decorators

  const { routes } = await import('./routes');

  app.use(cors);
  app.use(express.json());
  app.use(routes);

  app.listen(3001, () => {
    // eslint-disable-next-line no-console
    console.log('🚀 Server is running on http://localhost:3001');
  });
}

bootstrap();
