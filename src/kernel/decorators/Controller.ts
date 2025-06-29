import { Constructor } from '../../shared/types/Constructor';
import { normalizePath } from '../../shared/utils/normalizePath';

export const CONTROLLER_PREFIX_METADATA_KEY = 'custom:controller:prefix';
export const CONTROLLER_METADATA_KEY = 'custom:controller';

export function Controller(prefix: string): ClassDecorator {
  prefix = normalizePath(prefix);

  return (target) => {
    Reflect.defineMetadata(CONTROLLER_METADATA_KEY, true, target);
    Reflect.defineMetadata(CONTROLLER_PREFIX_METADATA_KEY, prefix, target);
  };
}

export function getPrefix(target: Constructor): string {
  return Reflect.getMetadata(CONTROLLER_PREFIX_METADATA_KEY, target);
}

export function isController(target: Constructor): boolean {
  return Reflect.getMetadata(CONTROLLER_METADATA_KEY, target);
}
