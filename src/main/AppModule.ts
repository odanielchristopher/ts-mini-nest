import { AccountsModule } from '../application/modules/accounts/AccountsModule';
import { AuthGuard } from '../application/modules/leads/LeadsController';
import { LeadsModule } from '../application/modules/leads/LeadsModule';
import { GlobalModule } from '../kernel/decorators/GlobalModule';

// O AppModule deve importar todos os modulos do sistema
@GlobalModule({
  imports: [AccountsModule, LeadsModule],
  guards: [AuthGuard],
})
export class AppModule {}
