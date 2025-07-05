import { ErrorCode } from '../../../../application/errors/ErrorCode';

interface IHttpErrorResponseParams {
  code: ErrorCode;
  message: any;
}

export function httpErrorResponse({ code, message }: IHttpErrorResponseParams) {
  return {
    error: {
      code,
      message,
    },
  };
}
