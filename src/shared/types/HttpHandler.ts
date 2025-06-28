import { HttpMethod } from './HttpMethod';

export type HttpHandler = {
  endpoint: string;
  method: HttpMethod;
};
