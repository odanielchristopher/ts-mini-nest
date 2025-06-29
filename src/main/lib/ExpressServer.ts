import express, { RequestHandler, Router } from 'express';
import { ZodError } from 'zod';

import { getSchema } from '../../kernel/decorators/Schema';
import { Registry } from '../../kernel/di/Registry';
import { Response } from '../../shared/types/Response';
import { parseRequest } from '../../shared/utils/parseRequest';
import { IServer } from '../contracts/Server';

export class ExpressServer implements IServer {
  constructor(private readonly port: number) {}

  async startServer() {
    const app = express();
    app.use(express.json());
    app.use(this.routes());

    app.listen(this.port, () => {
      // eslint-disable-next-line no-console
      console.log(`🚀 Server is running on http://localhost:${this.port}`);
    });
  }

  private routes() {
    const routes = Router();

    const registry = Registry.getInstance();

    const controllers = registry.getControllers();

    for (const { impl, prefix, handlers } of controllers) {
      const controller = registry.resolve(impl);

      for (const { method, endpoint, methodName } of handlers) {
        const fullPath = `${prefix}${endpoint}`;

        // eslint-disable-next-line no-console
        console.log(fullPath, method.toUpperCase());

        routes[method](fullPath, this.routeAdapter(controller, methodName));
      }
    }

    return routes;
  }

  private routeAdapter(controller: any, methodName: string): RequestHandler {
    const prototype = Object.getPrototypeOf(controller);

    const schema = getSchema(prototype, methodName);

    return async (request, response) => {
      try {
        // Faz parse da request, se houver schema
        const input = schema ? parseRequest(request, schema) : request;

        // Chama o handler original
        const { code, body }: Response<any> =
          await controller[methodName](input);

        response.status(code).send(body);
      } catch (error) {
        if (error instanceof ZodError) {
          response.status(400).send({ error: error.issues });
          return;
        }

        // eslint-disable-next-line no-console
        console.log(error);
        response.status(500).send({ error: 'Internal Server Error!' });
      }
    };
  }
}
