import { RolesGuard } from '../application/guards/RolesGuard';
import { AccountsModule } from '../application/modules/accounts/AccountsModule';
import { LeadsModule } from '../application/modules/leads/LeadsModule';
import { GlobalModule } from '../kernel/decorators/GlobalModule';

// O AppModule deve importar todos os modulos do sistema
@GlobalModule({
  imports: [AccountsModule, LeadsModule],
  guards: [RolesGuard],
})
export class AppModule {}
