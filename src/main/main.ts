import 'reflect-metadata';

import { loadModule } from '../kernel/di/loadModule';
import { IServer } from '../shared/contracts/Server';

import { AppModule } from './AppModule';
import { ExpressServer } from './lib/ExpressServer';

async function bootstrap() {
  loadModule(AppModule);

  const server: IServer = new ExpressServer();

  server.setupServer();

  await server.listen(3001, () =>
    // eslint-disable-next-line no-console
    console.log(`🚀 Server is running on http://localhost:3001`),
  );
}

bootstrap();
