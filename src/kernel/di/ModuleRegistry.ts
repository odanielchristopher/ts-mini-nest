import { Constructor } from '../../shared/types/Constructor';
import { getModuleMetadata, ModuleMetadata } from '../decorators/Module';

export class ModuleRegistry {
  private readonly modules = new Map<string, ModuleRegistry.Module>();

  register(module: Constructor) {
    const metadata = getModuleMetadata(module);
    if (!metadata) throw new Error(`${module.name} is not a module`);

    if (this.modules.has(module.name)) return;

    this.modules.set(module.name, {
      metadata,
      exports: new Set(metadata.exports?.map((e) => e.name)),
    });
  }

  isExported(module: Constructor, token: string): boolean {
    return this.modules.get(module.name)?.exports.has(token) ?? false;
  }

  isModuleImported(target: Constructor, current: Constructor): boolean {
    const currentModule = this.modules.get(current.name);
    if (!currentModule) return false;

    return (
      currentModule.metadata.imports?.some(
        (imported) =>
          imported === target || this.isModuleImported(target, imported),
      ) ?? false
    );
  }

  getModuleMetadata(module: Constructor): ModuleMetadata | undefined {
    return this.modules.get(module.name)?.metadata;
  }

  getModuleExports(module: Constructor): Set<string> | undefined {
    return this.modules.get(module.name)?.exports;
  }

  getModuleImports(module: Constructor): Constructor[] | undefined {
    return this.modules.get(module.name)?.metadata.imports;
  }

  getModuleGuards(module: Constructor): Constructor[] | undefined {
    return this.modules.get(module.name)?.metadata.guards;
  }
}

export namespace ModuleRegistry {
  export type Module = {
    metadata: ModuleMetadata;
    exports: Set<string>;
  };
}
