import { Constructor } from '../../shared/types/Constructor';
import { isController } from '../decorators/Controller';
import { isInjectable } from '../decorators/Injectable';

import { ModuleRegistry } from './ModuleRegistry';
import { ScopeValidator } from './ScopeValidator';

export class Container {
  private readonly instances = new Map<string, any>();
  private readonly providers = new Map<string, Container.Provider>();
  private readonly scopeValidator: ScopeValidator;

  constructor(
    private readonly moduleRegistry: ModuleRegistry,
    private readonly globalModule: Constructor,
  ) {
    this.scopeValidator = new ScopeValidator(
      moduleRegistry,
      this.getProviderModule.bind(this), // Injeta a função de lookup
      globalModule,
    );
  }

  register(impl: Constructor, module?: Constructor) {
    const token = impl.name;
    if (this.providers.has(token)) return;

    const deps = Reflect.getMetadata('design:paramtypes', impl) ?? [];
    this.providers.set(token, { impl, deps, module });
  }

  resolve<T extends Constructor>(
    impl: T,
    requestingModule?: Constructor,
    resolutionPath: Constructor[] = [],
  ): InstanceType<T> {
    if (resolutionPath.includes(impl)) {
      throw new Error(`Circular dependency detected for ${impl.name}`);
    }

    const provider = this.providers.get(impl.name);
    if (!provider) throw new Error(`Provider ${impl.name} not registered`);

    if (!isInjectable(impl) && !isController(impl)) {
      throw new Error(`'${impl.name}' is not injectable.`);
    }

    // Validação de escopo
    this.scopeValidator.verify(
      impl.name,
      provider.module,
      requestingModule,
      resolutionPath,
    );

    const deps = provider.deps.map((dep) =>
      this.resolve(dep, requestingModule, [...resolutionPath, impl]),
    );

    const instance = new provider.impl(...deps);
    this.instances.set(impl.name, instance);
    return instance;
  }

  private getProviderModule(provider: Constructor): Constructor | undefined {
    return this.providers.get(provider.name)?.module;
  }
}

export namespace Container {
  export type Provider = {
    impl: Constructor;
    deps: Constructor[];
    module?: Constructor;
  };
}
