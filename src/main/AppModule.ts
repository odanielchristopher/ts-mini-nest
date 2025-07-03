import { AccountsModule } from '../application/modules/accounts/AccountsModule';
import { LeadsModule } from '../application/modules/leads/LeadsModule';
import { Module } from '../kernel/decorators/Module';

// O AppModule deve importar todos os modulos do sistema
@Module({
  imports: [AccountsModule, LeadsModule],
})
export class AppModule {}
