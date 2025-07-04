import { z } from 'zod';

import { Controller } from '../../../kernel/decorators/Controller';
import { Get } from '../../../kernel/decorators/http/Get';
import { Module } from '../../../kernel/decorators/Module';
import { Schema } from '../../../kernel/decorators/Schema';
import { Request } from '../../../shared/types/Request';
import { AccountsModule } from '../accounts/AccountsModule';
import { AccountsService } from '../accounts/AccountsService';

@Controller('leads')
export class LeadsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get(':id')
  @Schema({
    params: z.object({
      id: z.string(),
    }),
  })
  geAll(request: Request) {
    console.log('Hello from leads', request.params);
  }
}

@Module({
  imports: [AccountsModule], // Importa o módulo que exporta o serviço
  controllers: [LeadsController],
})
export class LeadsModule {}
