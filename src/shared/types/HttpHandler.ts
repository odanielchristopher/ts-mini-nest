import { HttpMethod } from './HttpMethod';

export type HttpHandler = {
  endpoint: string;
  httpMethod: HttpMethod;
  methodName: string;
};
