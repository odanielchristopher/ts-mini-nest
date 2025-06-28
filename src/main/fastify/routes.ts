import { FastifyPluginAsync } from 'fastify';

import { getSchema } from '../../kernel/decorators/Schema';
import { Registry } from '../../kernel/di/Registry';
import { Response } from '../../shared/types/Response';

export const routes: FastifyPluginAsync = async (fastify) => {
  const registry = Registry.getInstance();

  const controllers = registry.getControllers();

  for (const { impl, prefix, handlers } of controllers) {
    const controller = registry.resolve(impl);

    for (const { method, endpoint, methodName } of handlers) {
      const fullPath = `${prefix}${endpoint}`;
      const upperCaseMethod = method.toUpperCase();

      console.log(fullPath, upperCaseMethod);

      const schema = getSchema(impl.prototype, methodName);

      fastify.route({
        method,
        url: fullPath,
        schema: {
          body: schema?.body,
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
