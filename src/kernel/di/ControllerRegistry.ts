import { Constructor } from '../../shared/types/Constructor';
import { HttpHandler } from '../../shared/types/HttpHandler';
import { getHandlerList } from '../../shared/utils/createRouteDecorator';
import { getPrefix, isController } from '../decorators/Controller';

export class ControllerRegistry {
  private readonly controllers = new Map<
    string,
    ControllerRegistry.Controller
  >();

  register(impl: Constructor, module?: Constructor) {
    if (!isController(impl)) return;

    if (this.controllers.has(impl.name)) return;

    this.controllers.set(impl.name, {
      impl,
      prefix: getPrefix(impl),
      handlers: getHandlerList(impl.prototype),
      module,
    });
  }

  getAll(): ControllerRegistry.Controller[] {
    return Array.from(this.controllers.values());
  }
}

export namespace ControllerRegistry {
  export type Controller = {
    impl: Constructor;
    prefix: string;
    handlers: Handler[];
    module?: Constructor;
  };

  export type Handler = HttpHandler & { methodName: string };
}
