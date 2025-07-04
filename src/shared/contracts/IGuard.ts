import { RequestRouteMetadata } from '../../kernel/context/RequestContext';

export interface IGuard {
  canActivate(context: RequestRouteMetadata): Promise<boolean> | boolean;
}
