import { z } from 'zod';

import { Controller } from '../../kernel/decorators/Controller';
import { Post } from '../../kernel/decorators/http/Post';
import { Schema } from '../../kernel/decorators/Schema';
import { Request } from '../../shared/types/Request';
import { Response } from '../../shared/types/Response';

const bodySchema = z.object(
  {
    name: z.string().nonempty(),
    age: z.number().min(0),
  },
  {
    message: 'Body is required',
  },
);

type Body = z.infer<typeof bodySchema>;

const paramsSchema = z.object(
  {
    userId: z.string().nonempty(),
  },
  {
    message: 'Params is required',
  },
);

type Params = z.infer<typeof paramsSchema>;

const querySchema = z.object(
  {
    isAdmin: z.string().nonempty(),
  },
  {
    message: 'Query is required',
  },
);

type Query = z.infer<typeof querySchema>;

@Controller('users')
export class UsersController {
  @Post(':userId')
  @Schema({
    body: bodySchema,
    params: paramsSchema,
    query: querySchema,
  })
  create(request: Request<Body, Params, Query>): Response<any> {
    const { body, params, query } = request;

    return {
      code: 200,
      body: { body, params, query },
    };
  }
}
