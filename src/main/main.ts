import 'reflect-metadata';

import { loadModule } from '../kernel/di/loadModule';

import { AppModule } from './AppModule';
import { FastifyServer } from './lib/FastifyServer';

async function bootstrap() {
  loadModule(AppModule);

  const server = new FastifyServer(3001);

  await server.startServer();
}

bootstrap();
