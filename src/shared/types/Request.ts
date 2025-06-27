export type Request<TBody = null, TParams = null, TQuery = null> = {
  body: TBody;
  params: TParams;
  query: TQuery;
};
