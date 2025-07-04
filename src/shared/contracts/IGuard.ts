import { Request } from '../types/Request';

export interface IGuard {
  canActivate(
    request: Request<unknown, unknown, unknown, unknown>,
  ): Promise<boolean> | boolean;
}
