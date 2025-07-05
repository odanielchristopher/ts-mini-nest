import { Constructor } from '../../shared/types/Constructor';
import { Registry } from '../di/Registry';

import { Module, ModuleMetadata } from './Module';

export function GlobalModule(metadata: ModuleMetadata): ClassDecorator {
  return (target) => {
    Registry.setGlobalModule(target as unknown as Constructor);

    const exports = new Set<Constructor>();

    metadata.providers?.forEach((p) => exports.add(p));
    metadata.guards?.forEach((g) => exports.add(g));
    metadata.controllers?.forEach((c) => exports.add(c));

    const extendedMetadata: ModuleMetadata = {
      ...metadata,
      exports: [...(metadata.exports ?? []), ...exports],
      providers: [...(metadata.providers ?? []), ...(metadata.guards ?? [])],
    };

    Module(extendedMetadata)(target);
  };
}
