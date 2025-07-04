import { Constructor } from '../../shared/types/Constructor';
import { isController } from '../decorators/Controller';
import { isInjectable } from '../decorators/Injectable';

import { ModuleRegistry } from './ModuleRegistry';
import { ScopeValidator } from './ScopeValidator';

export class Container {
  private readonly instances = new Map<string, any>();
  private readonly providers = new Map<string, Container.Provider>();
  private readonly scopeValidator: ScopeValidator;

  constructor(private readonly moduleRegistry: ModuleRegistry) {
    this.scopeValidator = new ScopeValidator(
      moduleRegistry,
      this.getProviderModule.bind(this), // Injeta a função de lookup
    );
  }

  register(impl: Constructor, module?: Constructor) {
    const token = impl.name;
    if (this.providers.has(token)) return;

    const deps = Reflect.getMetadata('design:paramtypes', impl) ?? [];
    this.providers.set(token, { impl, deps, module });
  }

  resolve<T extends Constructor>(
    token: T,
    requestingModule?: Constructor,
    resolutionPath: Constructor[] = [],
  ): InstanceType<T> {
    if (resolutionPath.includes(token)) {
      throw new Error(`Circular dependency detected for ${token.name}`);
    }

    const provider = this.providers.get(token.name);
    if (!provider) throw new Error(`Provider ${token.name} not registered`);

    if (!isInjectable(token) && !isController(token)) {
      throw new Error(`'${token.name}' is not injectable.`);
    }

    // Validação de escopo
    this.scopeValidator.verify(
      token.name,
      provider.module,
      requestingModule,
      resolutionPath,
    );

    const deps = provider.deps.map((dep) =>
      this.resolve(dep, requestingModule, [...resolutionPath, token]),
    );

    const instance = new provider.impl(...deps);
    this.instances.set(token.name, instance);
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
