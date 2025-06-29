import { HttpHandler } from '../../shared/types/HttpHandler';
import { HttpMethod } from '../../shared/types/HttpMethod';

import { normalizePath } from './normalizePath';

const HTTP_HANDLER_METADATA_KEY = 'custom:http';
const HTTP_HANDLER_LIST_METADATA_KEY = 'custom:http:all';

export function createRouteDecorator(method: HttpMethod) {
  return function (path = ''): MethodDecorator {
    path = path && normalizePath(path);

    return (target, propertyKey) => {
      const handlerMetadata: HttpHandler = {
        endpoint: path,
        method,
      };

      // Define metadado individual do handler
      Reflect.defineMetadata(
        HTTP_HANDLER_METADATA_KEY,
        handlerMetadata,
        target,
        propertyKey,
      );

      // Recupera a lista de handlers do prototype
      const existingHandlers =
        Reflect.getMetadata(HTTP_HANDLER_LIST_METADATA_KEY, target) || [];

      // Adiciona esse handler à lista geral
      Reflect.defineMetadata(
        HTTP_HANDLER_LIST_METADATA_KEY,
        [...existingHandlers, { methodName: propertyKey, ...handlerMetadata }],
        target,
      );
    };
  };
}

export function getHandlerList(prototype: any) {
  return Reflect.getMetadata(HTTP_HANDLER_LIST_METADATA_KEY, prototype) ?? [];
}
