import { Controller } from '../../../kernel/decorators/Controller';
import { Post } from '../../../kernel/decorators/http/Post';
import { Schema } from '../../../kernel/decorators/Schema';
import { Request } from '../../../shared/types/Request';
import { Response } from '../../../shared/types/Response';

import { AccountsService } from './AccountsService';
import { Account } from './entities/Account';
import {
  CreateAccountDto,
  createAccountSchema,
} from './schemas/createAccountSchema';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @Schema({
    body: createAccountSchema,
  })
  createAccount(request: Request<CreateAccountDto>): Response<Account> {
    const { name, email } = request.body;

    const body = this.accountsService.create({
      name,
      email,
    });

    return {
      code: 200,
      body,
    };
  }
}
