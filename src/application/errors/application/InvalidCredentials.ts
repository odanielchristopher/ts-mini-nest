import { ErrorCode } from '../ErrorCode';

import { ApplicationError } from './ApplicationError';

export class InvalidCredentials extends ApplicationError {
  public override statusCode = 401;

  public override code: ErrorCode;

  constructor() {
    super();

    this.name = 'InvalidCredentials';
    this.message = 'Invalid Credentials';
    this.code = ErrorCode.INVALID_REFRESH_TOKEN;
  }
}
