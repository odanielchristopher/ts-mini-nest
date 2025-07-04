import { IGuard } from '../../shared/contracts/IGuard';
import { Constructor } from '../../shared/types/Constructor';

const MODULE_METADATA_KEY = 'custom:module';
const CONTROLLER_OWNER_MODULE_METADATA_KEY = 'custom:controller:owner';

export type ModuleMetadata = {
  imports?: Constructor[];
  controllers?: Constructor[];
  providers?: Constructor[];
  exports?: Constructor[];
  guards?: Constructor<IGuard>[];
};

export function Module(metadata: ModuleMetadata): ClassDecorator {
  const controllers = metadata.controllers ?? [];

  return (target) => {
    controllers.forEach((controller) => setControllerOwner(target, controller));
    Reflect.defineMetadata(MODULE_METADATA_KEY, metadata, target);
  };
}

export function getModuleMetadata(target: Constructor): ModuleMetadata {
  return Reflect.getMetadata(MODULE_METADATA_KEY, target) ?? {};
}

export function setControllerOwner(target: any, controller: Constructor) {
  Reflect.defineMetadata(
    CONTROLLER_OWNER_MODULE_METADATA_KEY,
    target,
    controller,
  );
}

export function getControllerOwner(controller: Constructor) {
  return Reflect.getMetadata(CONTROLLER_OWNER_MODULE_METADATA_KEY, controller);
}
