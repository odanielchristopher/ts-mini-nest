import Fastify, { FastifyPluginAsync, RouteHandlerMethod } from 'fastify';
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { getSchema, SchemaOptions } from '../../kernel/decorators/Schema';
import { Registry } from '../../kernel/di/Registry';
import { IServer } from '../../shared/contracts/Server';
import { Response } from '../../shared/types/Response';

export class FastifyServer implements IServer {
  private readonly fastify = Fastify().withTypeProvider<ZodTypeProvider>();

  setupServer() {
    this.fastify.setValidatorCompiler(validatorCompiler);
    this.fastify.setSerializerCompiler(serializerCompiler);

    this.fastify.register(this.routes());
    this.setErrorHandler();
  }

  async listen(port: number, callback: (param?: any) => void): Promise<void> {
    try {
      await this.fastify.listen({ port });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
    callback();
  }

  private routes(): FastifyPluginAsync {
    return async (fastify) => {
      const registry = Registry.getInstance();

      const controllers = registry.getControllers();

      for (const { impl, prefix, handlers } of controllers) {
        const controller = registry.resolve(impl);

        for (const { method, endpoint, methodName } of handlers) {
          const fullPath = `${prefix}${endpoint}`;

          // eslint-disable-next-line no-console
          console.log(fullPath, method.toUpperCase());

          const schema = getSchema(impl.prototype, methodName);

          fastify.route({
            method,
            url: fullPath,
            schema: this.parseSchema(schema),
            handler: this.routeAdapter(controller, methodName),
          });
        }
      }
    };
  }

  private setErrorHandler() {
    this.fastify.setErrorHandler((error, _request, reply) => {
      if (hasZodFastifySchemaValidationErrors(error)) {
        return reply.code(400).send({
          error: error.validation.map((issue) => ({
            field: issue.instancePath,
            message: issue.message,
          })),
        });
      }

      // eslint-disable-next-line no-console
      console.log(error);
      return reply.code(500).send({ error: 'Internal server error.' });
    });
  }

  private parseSchema(schema: SchemaOptions | undefined) {
    const parsed: Record<string, unknown> = {};

    if (schema?.body) {
      parsed.body = schema.body;
    }
    if (schema?.params) {
      parsed.params = schema.params;
    }
    if (schema?.query) {
      parsed.querystring = schema.query;
    }

    return parsed;
  }

  private routeAdapter(
    controller: any,
    methodName: string,
  ): RouteHandlerMethod {
    return async (request, reply) => {
      const { code, body }: Response<any> =
        await controller[methodName](request);

      reply.code(code).send(body);
    };
  }
}
