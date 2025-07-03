import { Constructor } from '../../shared/types/Constructor';
import { getModuleMetadata } from '../decorators/Module';

import { Container } from './Container';
import { ControllerRegistry } from './ControllerRegistry';
import { ModuleRegistry } from './ModuleRegistry';
import { IRegistry } from './types';

export class Registry implements IRegistry {
  private static instance: Registry;

  private constructor(
    private readonly container: Container,
    private readonly moduleRegistry: ModuleRegistry,
    private readonly controllerRegistry: ControllerRegistry,
  ) {}

  static getInstance(): Registry {
    if (!this.instance) {
      const moduleRegistry = new ModuleRegistry();
      const container = new Container(moduleRegistry);
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
}
