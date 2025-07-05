import { Constructor } from '../../shared/types/Constructor';
import { getGuards } from '../decorators/Guard';
import { getControllerOwner, getModuleMetadata } from '../decorators/Module';

import { Container } from './Container';
import { ControllerRegistry } from './ControllerRegistry';
import { ModuleRegistry } from './ModuleRegistry';
import { IRegistry } from './types';

export class Registry implements IRegistry {
  private static instance: Registry;
  private static globalModule?: Constructor;

  static setGlobalModule(module: Constructor) {
    this.globalModule = module;
  }

  static getGlobalModule(): Constructor {
    if (!this.globalModule) {
      throw new Error('Global module is not registered.');
    }

    return this.globalModule;
  }

  private constructor(
    private readonly container: Container,
    private readonly moduleRegistry: ModuleRegistry,
    private readonly controllerRegistry: ControllerRegistry,
  ) {}

  static getInstance(): Registry {
    if (!this.instance) {
      const moduleRegistry = new ModuleRegistry();
      const container = new Container(moduleRegistry, this.getGlobalModule());
      const controllerRegistry = new ControllerRegistry();

      this.instance = new Registry(
        container,
        moduleRegistry,
        controllerRegistry,
      );
    }
    return this.instance;
  }

  registerModule(module: Constructor) {
    const metadata = getModuleMetadata(module);

    if (!metadata) throw new Error(`${module.name} is not a module`);

    this.moduleRegistry.register(module);

    // Process imports first
    metadata.imports?.forEach((imported) => this.registerModule(imported));

    // Register providers
    metadata.providers?.forEach((provider) => {
      this.container.register(provider, module);
    });

    // Register controllers
    metadata.controllers?.forEach((controller) => {
      this.controllerRegistry.register(controller, module);
      this.container.register(controller, module);
    });

    metadata.guards?.forEach((guard) => {
      this.container.register(guard, module);
    });
  }

  resolve<T extends Constructor>(
    token: T,
    requestingModule?: Constructor,
  ): InstanceType<T> {
    return this.container.resolve(token, requestingModule);
  }

  getControllers() {
    return this.controllerRegistry.getAll().map((controller) => ({
      ...controller,
      instance: this.resolve(controller.impl, controller.module),
    }));
  }

  getGuardsFor(controllerClass: Constructor, methodName: string) {
    const classGuards = getGuards(controllerClass) ?? [];
    const methodGuards = getGuards(controllerClass.prototype, methodName) ?? [];

    const module = getControllerOwner(controllerClass);
    const moduleGuards = module
      ? (this.moduleRegistry.getModuleGuards(module) ?? [])
      : [];

    const globalModule = Registry.getGlobalModule();
    const globalGuards =
      this.moduleRegistry.getModuleGuards(globalModule) ?? [];

    const allGuards = [
      ...globalGuards,
      ...moduleGuards,
      ...classGuards,
      ...methodGuards,
    ];

    // Remover duplicados por nome da classe mantendo a ordem
    const uniqueGuards = Array.from(
      new Map(allGuards.map((g) => [g.name, g])),
    ).map(([, guard]) => guard);

    const instances = [];
    for (const guard of uniqueGuards.values()) {
      instances.push(this.resolve(guard, module ?? globalModule));
    }

    return instances;
  }
}
