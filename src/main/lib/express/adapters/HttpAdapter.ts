import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  RequestHandler,
} from 'express';
import { ZodError } from 'zod';

import { ApplicationError } from '../../../../application/errors/application/ApplicationError';
import { ErrorCode } from '../../../../application/errors/ErrorCode';
import { HttpError } from '../../../../application/errors/http/HttpError';
import { RequestContext } from '../../../../kernel/context/RequestContext';
import { getSchema, SchemaOptions } from '../../../../kernel/decorators/Schema';
import { Registry } from '../../../../kernel/di/Registry';
import { IGuard } from '../../../../shared/contracts/IGuard';
import { Constructor } from '../../../../shared/types/Constructor';
import { Response } from '../../../../shared/types/Response';
import { httpErrorResponse } from '../helpers/httpErrorResponse';

export class HttpAdapter {
  execute<TImpl extends Constructor>(
    controller: InstanceType<TImpl>,
    methodName: string,
  ): RequestHandler {
    return async (request, response) => {
      const prototype = Object.getPrototypeOf(controller);

      RequestContext.run(
        {
          controller: {
            constructor: controller.constructor as Constructor,
            prototype,
          },
          request,
          propertyKey: methodName,
        },
        async () => {
          try {
            await this.executeGuards(controller, methodName, response);
            if (response.headersSent) return;

            const schema = getSchema(prototype, methodName);
            const input = schema ? this.parseRequest(request, schema) : request;

            const result: Response<unknown> | undefined =
              await controller[methodName](input);

            response.status(result?.code ?? 200).send(result?.body);
          } catch (error) {
            this.handleError(error, response);
          }
        },
      );
    };
  }

  private parseRequest(request: ExpressRequest, schema: SchemaOptions) {
    return {
      body: schema?.body ? schema.body.parse(request.body) : request.body,
      params: schema?.params
        ? schema.params.parse(request.params)
        : request.params,
      query: schema?.query ? schema.query.parse(request.query) : request.query,
    };
  }

  private handleError(error: unknown, response: ExpressResponse) {
    if (error instanceof ZodError) {
      response.status(400).send(
        httpErrorResponse({
          code: ErrorCode.VALIDATION,
          message: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            error: issue.message,
          })),
        }),
      );
      return;
    }

    if (error instanceof HttpError) {
      response.status(error.statusCode).send(httpErrorResponse(error));
      return;
    }

    if (error instanceof ApplicationError) {
      response.status(error.statusCode ?? 400).send(httpErrorResponse(error));
      return;
    }

    // eslint-disable-next-line no-console
    console.log(error);
    response.status(500).send(
      httpErrorResponse({
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      }),
    );
  }

  private async executeGuards<TImpl extends Constructor>(
    controller: InstanceType<TImpl>,
    methodName: string,
    response: ExpressResponse,
  ) {
    const guards: IGuard[] =
      Registry.getInstance().getGuardsFor(controller.constructor, methodName) ??
      [];

    const context = RequestContext.getContext();

    for (const guard of guards) {
      try {
        const isAllowed = await guard.canActivate(context);

        if (!isAllowed) {
          response.status(403).send(
            httpErrorResponse({
              code: ErrorCode.FORBIDDEN,
              message: 'Forbidden',
            }),
          );
          return;
        }
      } catch (error) {
        this.handleError(error, response);
        return;
      }
    }
  }
}
