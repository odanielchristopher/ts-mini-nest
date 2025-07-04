import { Constructor } from '../../shared/types/Constructor';

import { ModuleRegistry } from './ModuleRegistry';

export class ScopeValidator {
  constructor(
    private readonly moduleRegistry: ModuleRegistry,
    private readonly getProviderModule: (
      provider: Constructor,
    ) => Constructor | undefined,
  ) {}

  verify(
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
}
