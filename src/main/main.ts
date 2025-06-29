import 'reflect-metadata';

import { loadModule } from '../kernel/di/loadModule';

import { AppModule } from './AppModule';
import { FastifyServer } from './lib/FastifyServer';

async function bootstrap() {
  loadModule(AppModule);

  const server = new FastifyServer();

  server.startServer();

  await server.listen(3001, () =>
    // eslint-disable-next-line no-console
    console.log(`🚀 Server is running on http://localhost:3001`),
  );
}

bootstrap();
