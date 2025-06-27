import { HttpHandler } from '../../di/Registry';

export function Put(path?: string): MethodDecorator {
  const endpoint = path ? `/${path}` : '/';

  return (target, propertyKey) => {
    const handler: HttpHandler = {
      endpoint,
      method: 'put',
      handler: propertyKey as string,
    };

    Reflect.defineMetadata('custom:http', handler, target, propertyKey);
  };
}
