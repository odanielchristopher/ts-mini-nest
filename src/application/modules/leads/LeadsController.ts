import z from 'zod';

import { Controller } from '../../../kernel/decorators/Controller';
import { Guard } from '../../../kernel/decorators/Guard';
import { Get } from '../../../kernel/decorators/http/Get';
import { Injectable } from '../../../kernel/decorators/Injectable';
import { Schema } from '../../../kernel/decorators/Schema';
import { IGuard } from '../../../shared/contracts/IGuard';
import { Request } from '../../../shared/types/Request';
import { AccountsService } from '../accounts/AccountsService';

@Injectable()
export class AuthGuard implements IGuard {
  canActivate() {
    console.log('Chamou o auth');
    return true;
  }
}

@Injectable()
export class LogGuard implements IGuard {
  canActivate() {
    console.log('Chamou o log');

    return true;
  }
}

@Controller('leads')
export class LeadsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get(':id')
  @Schema({
    params: z.object({
      id: z.string(),
    }),
  })
  @Guard(LogGuard)
  geAll(request: Request) {
    console.log('Hello from leads', request.params);
  }
}
