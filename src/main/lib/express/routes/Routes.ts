import { Router } from 'express';

import { Registry } from '../../../../kernel/di/Registry';
import { HttpAdapter } from '../adapters/HttpAdapter';

export class Routes {
  private readonly httpAdapter = new HttpAdapter();

  setup(): Router {
    const routes = Router();

    const registry = Registry.getInstance();

    const controllers = registry.getControllers();

    for (const { instance, prefix, handlers } of controllers) {
      for (const { method, endpoint, methodName } of handlers) {
        const fullPath = `${prefix}${endpoint}`;

        // eslint-disable-next-line no-console
        console.log(fullPath, method.toUpperCase());

        routes[method](
          fullPath,
          this.httpAdapter.execute(instance, methodName),
        );
      }
    }

    return routes;
  }
}
