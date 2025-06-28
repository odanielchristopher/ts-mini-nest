import { Module } from '../../../kernel/decorators/Module';

import { AccountsController } from './AccountsController';
import { AccountsRepository } from './AccountsRepository';
import { AccountsService } from './AccountsService';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService, AccountsRepository],
})
export class AccountsModule {}
