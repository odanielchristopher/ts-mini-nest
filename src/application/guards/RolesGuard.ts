import {
  RequestContext,
  RequestRouteMetadata,
} from '../../kernel/context/RequestContext';
import { Injectable } from '../../kernel/decorators/Injectable';
import { IGuard } from '../../shared/contracts/IGuard';
import { IS_PUBLIC_KEY } from '../../shared/decorators/IsPublic';
import { REQUIRED_ROLES_KEY } from '../../shared/decorators/RequiredRoles';

@Injectable()
export class RolesGuard implements IGuard {
  canActivate(context: RequestRouteMetadata) {
    // Verifica primeiro o handler (mais específico), depois a classe (mais genérico)
    console.log('Chamou o roles');
    const isPublic = RequestContext.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getTargetHandler(),
      context.getTargetClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const requiredRoles = RequestContext.getAllAndOverride<string[]>(
      REQUIRED_ROLES_KEY,
      [context.getTargetHandler(), context.getTargetClass()],
    );

    // Lógica de verificação de roles aqui
    console.log('Required Roles:', requiredRoles);

    return true; // ou false baseado na verificação
  }
}
