import { Constructor } from '../../shared/types/Constructor';
import { HttpHandler } from '../../shared/types/HttpHandler';
import { getHandlerList } from '../../shared/utils/createRouteDecorator';
import { getPrefix, isController } from '../decorators/Controller';
import { isInjectable } from '../decorators/Injectable';

export class Registry {
  private static instance: Registry;

  private readonly providers = new Map<string, Registry.Provider>();
  private readonly controllers: Registry.Controller[] = [];

  static getInstance() {
    if (!this.instance) {
      this.instance = new Registry();
    }

    return this.instance;
  }

  private constructor() {}

  register(impl: Constructor) {
    const token = impl.name;

    if (this.providers.has(token)) {
      return;
    }

    // Descobre dependências do construtor
    const deps = Reflect.getMetadata('design:paramtypes', impl) ?? [];

    this.providers.set(token, {
      impl,
      deps,
    });

    // Verifica se é um controller
    if (isController(impl)) {
      this.setController(impl);
    }
  }

  resolve<TImpl extends Constructor>(impl: TImpl): InstanceType<TImpl> {
    const token = impl.name;
    const provider = this.providers.get(token);

    if (!provider) {
      throw new Error(`'${token}' not registered.`);
    }

    if (!isInjectable(impl) && !isController(impl)) {
      throw new Error(`'${token}' is not injectable.`);
    }

    const deps = provider.deps.map((dep) => this.resolve(dep));
    const instance = new provider.impl(...deps);

    return instance;
  }

  getControllers(): Registry.Controller[] {
    return this.controllers;
  }

  private setController(impl: Constructor) {
    const prototype = impl.prototype;

    const prefix = getPrefix(impl);
    const handlers = getHandlerList(prototype);

    this.controllers.push({
      impl,
      prefix,
      handlers,
    });
  }
}

export namespace Registry {
  export type Provider = {
    impl: Constructor;
    deps: Constructor[];
  };

  export type Controller = {
    impl: Constructor;
    prefix: string;
    handlers: (HttpHandler & { methodName: string })[];
  };
}
