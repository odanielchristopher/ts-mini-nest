/* eslint-disable no-console */
import { Router } from 'express';

import { Registry } from '../../kernel/di/Registry';

import { expressRouteAdapter } from './adapters/routeAdapter';

export function createRoutes() {
  const routes = Router();

  const registry = Registry.getInstance();

  const controllers = registry.getControllers();

  for (const { impl, prefix, handlers } of controllers) {
    const controller = registry.resolve(impl);

    for (const { method, endpoint, methodName } of handlers) {
      const fullPath = `${prefix}${endpoint}`;

      console.log(fullPath, method.toUpperCase());

      routes[method](fullPath, expressRouteAdapter(controller, methodName));
    }
  }

  return routes;
}
