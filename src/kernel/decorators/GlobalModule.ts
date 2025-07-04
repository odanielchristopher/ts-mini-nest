import { Constructor } from '../../shared/types/Constructor';
import { Registry } from '../di/Registry';

import { Module, ModuleMetadata } from './Module';

// kernel/decorators/GlobalModule.ts
export function GlobalModule(metadata: ModuleMetadata): ClassDecorator {
  return (target) => {
    // Marca como módulo global
    Registry.setGlobalModule(target as unknown as Constructor);

    // Exporta automaticamente tudo
    const exports = new Set<Constructor>();

    metadata.providers?.forEach((p) => exports.add(p));
    metadata.guards?.forEach((g) => exports.add(g));
    metadata.controllers?.forEach((c) => exports.add(c));

    // Cria o metadata real incluindo os exports
    const extendedMetadata: ModuleMetadata = {
      ...metadata,
      exports: [...(metadata.exports ?? []), ...exports],
      // Força os guards a serem registrados como providers também
      providers: [...(metadata.providers ?? []), ...(metadata.guards ?? [])],
    };

    // Aplica o decorador original @Module
    Module(extendedMetadata)(target);
  };
}
