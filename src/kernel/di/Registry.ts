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

    // Descobre dependências do construtor
    const deps = Reflect.getMetadata('design:paramtypes', impl) ?? [];

    const hasToken = this.providers.get(token);

    if (hasToken) {
      if (hasToken.deps.length !== deps.length) {
        this.providers.delete(token); // corrigido aqui

        this.register(impl, isController, prefix); // re-registra com os novos deps
      }

      return;
    }

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
      const prototype = impl.prototype;

      const methodNames = Object.getOwnPropertyNames(prototype).filter(
        (name) =>
          typeof prototype[name] === 'function' && name !== 'constructor',
      );

      for (const name of methodNames) {
        const handler: HttpHandler | undefined = Reflect.getMetadata(
          'custom:http',
          prototype,
          name,
        );
        if (handler) {
          provider.handlers!.push({ ...handler, handler: name });
        }
      }
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
}

export namespace Registry {
  export type Provider = {
    impl: Constructor;
    deps: Constructor[];
    prefix: string;
    handlers?: HttpHandler[];
    isController: boolean;
  };

  export type ResolveOutPut<TImpl extends Constructor> = {
    instance: InstanceType<TImpl>;
    handlers: HttpHandler[];
    prefix: string;
  };
}
