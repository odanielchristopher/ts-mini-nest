import { Constructor } from '../../shared/types/Constructor';
import { getModuleMetadata } from '../decorators/Module';

import { Registry } from './Registry';

export function loadModule(module: Constructor) {
  const registry = Registry.getInstance();

  const {
    imports = [],
    controllers = [],
    providers = [],
  } = getModuleMetadata(module);

  // Registra os controllers
  for (const controller of controllers) {
    registry.register(controller);
  }

  // Registra os providers
  for (const provider of providers) {
    registry.register(provider);
  }

  // Registra módulos importados (recursivamente)
  for (const imported of imports) {
    loadModule(imported);
  }
}
