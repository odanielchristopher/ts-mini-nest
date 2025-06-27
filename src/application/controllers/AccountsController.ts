import { Controller } from '../../kernel/decorators/Controller';
import { Get } from '../../kernel/decorators/http/Get';
import { Post } from '../../kernel/decorators/http/Post';
import { Schema } from '../../kernel/decorators/Schema';
import { Request } from '../../shared/types/Request';
import { Response } from '../../shared/types/Response';
import { Account } from '../repositories/AccountsRepository';
import {
  CreateAccountDto,
  createAccountSchema,
} from '../schemas/accounts/createAccountSchema';
import {
  GetOneAccountQuery,
  getOneAccountQuerySchema,
} from '../schemas/accounts/getOneAccountQuerySchema';
import { AccountsService } from '../services/AccountsService';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  getAll(): Response<Account[]> {
    const body = this.accountsService.findAll();

    return {
      code: 200,
      body,
    };
  }

  @Get(':accountId')
  @Schema({
    params: getOneAccountQuerySchema,
  })
  getOne(
    request: Request<null, GetOneAccountQuery>,
  ): Response<{ accountId: string }> {
    const { accountId } = request.params;

    return {
      code: 200,
      body: { accountId },
    };
  }

  @Post()
  @Schema({
    body: createAccountSchema,
  })
  create(request: Request<CreateAccountDto>): Response<Account> {
    const { name, email, password } = request.body;

    const body = this.accountsService.createAccount({
      name,
      email,
      password,
    });

    return {
      code: 201,
      body,
    };
  }
}
