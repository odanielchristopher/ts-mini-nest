import Fastify, { FastifyPluginAsync } from 'fastify';
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { getSchema } from '../../kernel/decorators/Schema';
import { Registry } from '../../kernel/di/Registry';
import { Response } from '../../shared/types/Response';
import { IServer } from '../contracts/Server';

export class FastifyServer implements IServer {
  private readonly fastify = Fastify().withTypeProvider<ZodTypeProvider>();

  constructor(private readonly port: number) {}

  async startServer(): Promise<void> {
    this.fastify.setValidatorCompiler(validatorCompiler);
    this.fastify.setSerializerCompiler(serializerCompiler);

    this.fastify.register(this.routes());
    this.setErrorHandler();

    try {
      await this.fastify.listen({ port: this.port });

      // eslint-disable-next-line no-console
      console.log(`🚀 Server is running on http://localhost:${this.port}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
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

          const {
            body,
            params,
            query: querystring,
          } = getSchema(impl.prototype, methodName);

          fastify.route({
            method,
            url: fullPath,
            schema: {
              body,
              params,
              querystring,
            },
            handler: async (request, reply) => {
              const { code, body }: Response<any> =
                await controller[methodName](request);

              reply.code(code).send(body);
            },
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
}
