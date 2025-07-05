import { AsyncLocalStorage } from 'async_hooks';

import { Constructor } from '../../shared/types/Constructor';
import { Request } from '../../shared/types/Request';

type RequestRouteInput = {
  controller: {
    constructor: Constructor;
    prototype: any;
  };
  request: Request<any, any, any, any>;
  propertyKey: string;
};

export type RequestRouteMetadata = RequestRouteInput & {
  getClass(): Constructor;
  getPrototype(): any;
  getHandler(): string | symbol;
  getTargetClass(): { target: Constructor };
  getTargetHandler(): { target: any; propertyKey: string | symbol };
};

const asyncLocalStorage = new AsyncLocalStorage<RequestRouteMetadata>();

export class RequestContext {
  static run<T>(input: RequestRouteInput, callback: (...args: any[]) => T): T {
    const metadata = this.createMetadata(input);

    return asyncLocalStorage.run(metadata, callback);
  }

  static getContext(): RequestRouteMetadata {
    const ctx = asyncLocalStorage.getStore();

    if (!ctx) {
      throw new Error('Context is not provided.');
    }

    return ctx;
  }

  static getAllAndOverride<T = any>(
    key: string,
    targets: Array<{ target: any; propertyKey?: string | symbol }>,
  ): T | T[] | undefined {
    // Ordem inversa: do mais específico para o mais genérico
    for (let i = targets.length - 1; i >= 0; i--) {
      const { target, propertyKey } = targets[i];

      const metadata =
        propertyKey === undefined
          ? Reflect.getMetadata(key, target)
          : Reflect.getMetadata(key, target, propertyKey);

      if (metadata !== undefined) {
        return metadata; // Retorna o valor exatamente como foi armazenado
      }
    }
    return undefined;
  }

  private static createMetadata(
    input: RequestRouteInput,
  ): RequestRouteMetadata {
    return {
      ...input,
      getClass: () => input.controller.constructor,
      getPrototype: () => input.controller.prototype,
      getHandler: () => input.propertyKey,
      getTargetClass: () => ({
        target: input.controller.constructor,
      }),
      getTargetHandler: () => ({
        target: input.controller.prototype,
        propertyKey: input.propertyKey,
      }),
    };
  }
}
