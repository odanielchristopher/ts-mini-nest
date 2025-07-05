export type Request<
  TBody = null,
  TParams = null,
  TQuery = null,
  THeaders = unknown,
> = {
  body: TBody;
  params: TParams;
  query: TQuery;
  headers: THeaders;
};
