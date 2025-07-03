import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  RequestHandler,
} from 'express';
import { ZodError } from 'zod';

import { getSchema, SchemaOptions } from '../../../../kernel/decorators/Schema';
import { Constructor } from '../../../../shared/types/Constructor';
import { Response } from '../../../../shared/types/Response';

export class HttpAdapter {
  execute<TImpl extends Constructor>(
    controller: InstanceType<TImpl>,
    methodName: string,
  ): RequestHandler {
    return async (request, response) => {
      try {
        // 1. Configuração inicial
        const prototype = Object.getPrototypeOf(controller);

        const schema = getSchema(prototype, methodName);

        // 2. Processamento da requisição principal
        const input = schema ? this.parseRequest(request, schema) : request;
        const result: Response<unknown> | undefined =
          await controller[methodName](input);

        response.status(result?.code ?? 200).send(result?.body);
      } catch (error) {
        this.handleError(error, response);
      }
    };
  }

  private parseRequest(request: ExpressRequest, schema: SchemaOptions) {
    return {
      body: schema?.body ? schema.body.parse(request.body) : undefined,
      params: schema?.params ? schema.params.parse(request.params) : undefined,
      query: schema?.query ? schema.query.parse(request.query) : undefined,
    };
  }

  private handleError(error: unknown, response: ExpressResponse) {
    if (error instanceof ZodError) {
      response.status(400).send({ error: error.issues });
      return;
    }

    // eslint-disable-next-line no-console
    console.log(error);
    response.status(500).send({ error: 'Internal Server Error!' });
  }
}
