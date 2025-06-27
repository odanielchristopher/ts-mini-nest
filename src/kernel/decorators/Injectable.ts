import { Constructor } from '../../shared/types/Constructor';
import { Registry } from '../di/Registry';

export function Injectable(): ClassDecorator {
  return (target) => {
    Registry.getInstance().register(target as unknown as Constructor);
  };
}
