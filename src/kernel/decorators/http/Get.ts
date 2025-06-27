import { HttpHandler } from '../../di/Registry';

export function Get(path?: string): MethodDecorator {
  const endpoint = path ? `/${path}` : '/';

  return (target, propertyKey) => {
    const handler: HttpHandler = {
      endpoint,
      method: 'get',
      handler: propertyKey as string,
    };

    Reflect.defineMetadata('custom:http', handler, target, propertyKey);
  };
}
