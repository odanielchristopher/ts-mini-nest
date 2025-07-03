import { Constructor } from '../../shared/types/Constructor';

const MODULE_METADATA_KEY = 'custom:module';

export type ModuleMetadata = {
  imports?: Constructor[];
  controllers?: Constructor[];
  providers?: Constructor[];
  exports?: Constructor[];
};

export function Module(metadata: ModuleMetadata): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(MODULE_METADATA_KEY, metadata, target);
  };
}

export function getModuleMetadata(target: Constructor): ModuleMetadata {
  return Reflect.getMetadata(MODULE_METADATA_KEY, target) ?? {};
}
