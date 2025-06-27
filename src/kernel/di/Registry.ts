import { Constructor } from '../../shared/types/Constructor';
import { HttpHandler } from '../../shared/types/HttpHandler';

export class Registry {
  private static instance: Registry;

  private readonly providers = new Map<string, Registry.Provider>();

  static getInstance() {
    if (!this.instance) {
      this.instance = new Registry();
    }

    return this.instance;
  }

  private constructor() {}

  register(impl: Constructor, isController = false, prefix = '') {
    const token = impl.name;

    if (this.providers.has(token)) {
      return;
    }

    // Descobre dependências do construtor
    const deps = Reflect.getMetadata('design:paramtypes', impl) ?? [];

    // Inicializa o provider
    const provider: Registry.Provider = {
      impl,
      deps,
      handlers: [],
      prefix,
      isController,
    };

    // Se for um controller, busca os handlers nos metadados do prototype
    if (isController) {
      this.setHandlers(provider);
    }

    this.providers.set(token, provider);
  }

  resolve<TImpl extends Constructor>(
    impl: TImpl,
  ): Registry.ResolveOutPut<TImpl> {
    const token = impl.name;
    const provider = this.providers.get(token);

    if (!provider) {
      throw new Error(`'${token}' not registered.`);
    }

    const deps = provider.deps.map((dep) => this.resolve(dep).instance);
    const instance = new provider.impl(...deps);

    return {
      instance,
      prefix: provider.prefix,
      handlers: provider.handlers ?? [],
    };
  }

  getControllers(): Constructor[] {
    return Array.from(this.providers.values())
      .filter((provider) => provider.isController)
      .map((provider) => provider.impl);
  }

  private getMethodNames(impl: Constructor): string[] {
    const prototype = impl.prototype;

    return Object.getOwnPropertyNames(prototype).filter(
      (name) => typeof prototype[name] === 'function' && name !== 'constructor',
    );
  }

  private setHandlers(provider: Registry.Provider) {
    const prototype = provider.impl.prototype;

    const methodNames = this.getMethodNames(provider.impl);

    for (const name of methodNames) {
      const handler: HttpHandler | undefined = Reflect.getMetadata(
        'custom:http',
        prototype,
        name,
      );

      if (handler) {
        provider.handlers.push({ ...handler, methodName: name });
      }
    }
  }
}

export namespace Registry {
  export type Provider = {
    impl: Constructor;
    deps: Constructor[];
    prefix: string;
    handlers: HttpHandler[];
    isController: boolean;
  };

  export type ResolveOutPut<TImpl extends Constructor> = {
    instance: InstanceType<TImpl>;
    handlers: HttpHandler[];
    prefix: string;
  };
}
