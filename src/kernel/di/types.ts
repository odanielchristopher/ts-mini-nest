import { Constructor } from '../../shared/types/Constructor';

import { ControllerRegistry } from './ControllerRegistry';

export interface IRegistry {
  registerModule(module: Constructor): void;
  resolve<T extends Constructor>(
    token: T,
    requestingModule?: Constructor,
  ): InstanceType<T>;
  getControllers(): ControllerRegistry.Controller[];
}
