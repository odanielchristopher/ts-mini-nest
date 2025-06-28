import { Constructor } from '../../shared/types/Constructor';

export const INJECTABLE_METADATA_KEY = 'custom:injectable';

export function Injectable(): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, target);
  };
}

export function isInjectable(target: Constructor): boolean {
  return Reflect.getMetadata(INJECTABLE_METADATA_KEY, target);
}
