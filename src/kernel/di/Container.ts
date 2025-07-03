import { Constructor } from '../../shared/types/Constructor';
import { isController } from '../decorators/Controller';
import { isInjectable } from '../decorators/Injectable';

import { ModuleRegistry } from './ModuleRegistry';

export class Container {
  private readonly instances = new Map<string, any>();
  private readonly providers = new Map<string, Container.Provider>();

  constructor(private readonly moduleRegistry: ModuleRegistry) {}

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
    this.verifyScope(
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

  private verifyScope(
    token: string,
    tokenModuleOwner: Constructor | undefined,
    requestingModule: Constructor | undefined,
    resolutionPath: Constructor[],
  ) {
    // Providers globais (sem módulo) são sempre acessíveis
    if (!tokenModuleOwner) return;

    // Se não houver módulo solicitante, apenas permite se for uma dependência interna
    if (!requestingModule) {
      const isInternalDependency =
        resolutionPath.length > 0 &&
        this.getProviderModule(resolutionPath[0]) === tokenModuleOwner;

      if (!isInternalDependency) {
        throw new Error(
          `Provider ${token} is module-scoped but no requesting module was provided`,
        );
      }
      return;
    }

    // Verifica acesso para módulo solicitante
    if (
      !this.isAccessible(
        token,
        tokenModuleOwner,
        requestingModule,
        resolutionPath,
      )
    ) {
      throw new Error(
        `Provider ${token} from module ${tokenModuleOwner.name} is not accessible in module ${requestingModule.name}`,
      );
    }
  }

  private isAccessible(
    token: string,
    tokenModuleOwner: Constructor,
    requestingModule: Constructor,
    resolutionPath: Constructor[],
  ): boolean {
    // 1. Mesmo módulo - sempre permitido
    if (tokenModuleOwner === requestingModule) return true;

    // 2. Verifica se é uma dependência interna
    if (this.isInternalDependency(tokenModuleOwner, resolutionPath)) {
      return true;
    }

    // 3. Verifica se o provider está nos exports do módulo
    const providerExports =
      this.moduleRegistry.getModuleExports(tokenModuleOwner);
    if (!providerExports?.has(token)) return false;

    // 4. Verifica se o módulo do provider está acessível
    return this.isModuleAccessible(tokenModuleOwner, requestingModule);
  }

  private isInternalDependency(
    providerModule: Constructor,
    resolutionPath: Constructor[],
  ): boolean {
    if (resolutionPath.length === 0) return false;

    // Obtém o módulo do primeiro elemento da cadeia de resolução
    const rootResolutionModule = this.getProviderModule(
      resolutionPath[resolutionPath.length - 1],
    );

    return rootResolutionModule === providerModule;
  }

  private isModuleAccessible(
    targetModule: Constructor,
    requestingModule: Constructor,
  ): boolean {
    // Obtém imports diretos do módulo solicitante
    const directImports =
      this.moduleRegistry.getModuleImports(requestingModule) || [];

    // Verifica imports diretos
    if (directImports.includes(targetModule)) return true;

    // Verifica imports transitivos
    return directImports.some((importedModule) =>
      this.isModuleAccessible(targetModule, importedModule),
    );
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
