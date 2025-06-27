import 'reflect-metadata';

import express from 'express';

import { loadProjectFiles } from '../kernel/di/load';

const app = express();

async function bootstrap() {
  await loadProjectFiles(); // Carrega todos os arquivos da pasta application e ativa os decorators

  const { routes } = await import('./routes');

  app.use(express.json());
  app.use(routes);

  app.listen(3001, () => {
    // eslint-disable-next-line no-console
    console.log('🚀 Server is running on http://localhost:3001');
  });
}

bootstrap();
