import { Request } from 'express';

import { SchemaOptions } from '../../kernel/decorators/Schema';

export function parseRequest(request: Request, schema: SchemaOptions) {
  return {
    body: schema?.body ? schema.body.parse(request.body) : undefined,
    params: schema?.params ? schema.params.parse(request.params) : undefined,
    query: schema?.query ? schema.query.parse(request.query) : undefined,
  };
}
