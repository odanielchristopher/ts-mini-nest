import { HttpHandler } from '../../../shared/types/HttpHandler';

export function Delete(path?: string): MethodDecorator {
  const endpoint = path ? `/${path}` : '/';

  return (target, propertyKey) => {
    const handler: HttpHandler = {
      endpoint,
      method: 'delete',
      handler: propertyKey as string,
    };

    Reflect.defineMetadata('custom:http', handler, target, propertyKey);
  };
}
