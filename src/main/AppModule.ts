import { AccountsModule } from '../application/modules/accounts/AccountsModule';
import { Module } from '../kernel/decorators/Module';

// O AppModule deve importar todos os modulos do sistema
@Module({
  imports: [AccountsModule],
})
export class AppModule {}
