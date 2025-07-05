import { Injectable } from '../../../kernel/decorators/Injectable';
import { EmailAlreadyInUse } from '../../errors/application/EmailAlreadyInUse';

import { AccountsRepository } from './AccountsRepository';
import { Account } from './entities/Account';

@Injectable()
export class AccountsService {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  create(createAccountDto: AccountsService.CreateAccountDto): Account {
    const { email, name } = createAccountDto;

    const emailAlreadyExists = this.accountsRepository.findByEmail(email);

    if (emailAlreadyExists) {
      throw new EmailAlreadyInUse();
    }

    const account = this.accountsRepository.create({ name, email });

    return account;
  }
}

export namespace AccountsService {
  export type CreateAccountDto = {
    name: string;
    email: string;
  };
}
