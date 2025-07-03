import { Controller } from '../../../kernel/decorators/Controller';
import { Get } from '../../../kernel/decorators/http/Get';
import { Module } from '../../../kernel/decorators/Module';
import { AccountsModule } from '../accounts/AccountsModule';
import { AccountsService } from '../accounts/AccountsService';

@Controller('leads')
export class LeadsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  getAll() {
    console.log({ accountsService: this.accountsService });
    console.log('GET LEADS');
  }
}

@Module({
  imports: [AccountsModule], // Importa o módulo que exporta o serviço
  controllers: [LeadsController],
})
export class LeadsModule {}
