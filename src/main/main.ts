import 'reflect-metadata';

import { loadModule } from '../kernel/di/loadModule';

import { AppModule } from './AppModule';
import { startExpress } from './express/start';

async function bootstrap() {
  loadModule(AppModule);

  startExpress();
}

bootstrap();
