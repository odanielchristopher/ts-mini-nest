import { Router } from 'express';

import { Registry } from '../kernel/di/Registry';

import { routeAdapter } from './adapters/routeAdapter';

export const routes = Router();

const impls = Registry.getInstance().getControllers();

impls.forEach((impl) => {
  const {
    handlers,
    prefix,
    instance: controller,
  } = Registry.getInstance().resolve(impl);

  handlers.forEach(({ endpoint, handler, method }) => {
    const path = `${prefix}${endpoint}`;

    routes[method](path, routeAdapter(impl, controller, handler));
  });
});
