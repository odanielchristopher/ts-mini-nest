import { HttpHandler } from '../../di/Registry';

export function Post(path?: string): MethodDecorator {
  const endpoint = path ? `/${path}` : '/';

  return (target, propertyKey) => {
    const handler: HttpHandler = {
      endpoint,
      method: 'post',
      handler: propertyKey as string,
    };

    Reflect.defineMetadata('custom:http', handler, target, propertyKey);
  };
}
