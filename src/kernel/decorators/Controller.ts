import { Constructor } from '../../shared/types/Constructor';
import { Registry } from '../di/Registry';

export function Controller(prefix?: string): ClassDecorator {
  if (prefix) {
    prefix = `/${prefix}`;
  }

  const isController = true;

  return (target) => {
    Registry.getInstance().register(
      target as unknown as Constructor,
      isController,
      prefix,
    );
  };
}
