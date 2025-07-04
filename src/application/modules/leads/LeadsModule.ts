import { Injectable } from '../../../kernel/decorators/Injectable';
import { Module } from '../../../kernel/decorators/Module';
import { IGuard } from '../../../shared/contracts/IGuard';
import { AccountsModule } from '../accounts/AccountsModule';

import { LeadsController, LogGuard } from './LeadsController';

@Injectable()
export class ModuleGuard implements IGuard {
  canActivate() {
    console.log('Chamou o ModuleGuard');

    return true;
  }
}

@Module({
  imports: [AccountsModule], // Importa o módulo que exporta o serviço
  controllers: [LeadsController],
  guards: [ModuleGuard, LogGuard],
})
export class LeadsModule {}
