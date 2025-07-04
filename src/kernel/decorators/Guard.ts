import { IGuard } from '../../shared/contracts/IGuard';
import { Constructor } from '../../shared/types/Constructor';

export const GUARDS_METADATA_KEY = 'custom:guards';

export function Guard(
  ...guards: Constructor<IGuard>[]
): ClassDecorator & MethodDecorator {
  return (target: any, propertyKey?: string | symbol) => {
    if (typeof propertyKey === 'undefined') {
      // Class decorator
      setControllerGuard(target, guards);
    } else {
      // Method decorator
      setMethodGuard(target, propertyKey, guards);
    }
  };
}

export function getGuards(target: any, propertyKey?: string | symbol) {
  return propertyKey
    ? Reflect.getMetadata(GUARDS_METADATA_KEY, target, propertyKey)
    : Reflect.getMetadata(GUARDS_METADATA_KEY, target);
}

export function setControllerGuard(
  target: Constructor,
  newGuards: Constructor[],
) {
  const guards = getControllerGuards(target);
  Reflect.defineMetadata(
    GUARDS_METADATA_KEY,
    [...guards, ...newGuards],
    target,
  );
}

export function setMethodGuard(
  target: any,
  propertyKey: string | symbol,
  newGuards: Constructor[],
) {
  const guards =
    Reflect.getMetadata(GUARDS_METADATA_KEY, target, propertyKey) || [];
  Reflect.defineMetadata(
    GUARDS_METADATA_KEY,
    [...guards, ...newGuards],
    target,
    propertyKey,
  );
}

export function getControllerGuards(controller: Constructor) {
  return Reflect.getMetadata(GUARDS_METADATA_KEY, controller) || [];
}

export function getMethodGuards(target: any, propertyKey: string | symbol) {
  return Reflect.getMetadata(GUARDS_METADATA_KEY, target, propertyKey) || [];
}
