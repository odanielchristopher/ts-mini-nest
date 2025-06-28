import { randomUUID } from 'node:crypto';

import { Injectable } from '../../../kernel/decorators/Injectable';

import { Account } from './entities/Account';

@Injectable()
export class AccountsRepository {
  private accounts: Account[] = [];

  findByEmail(email: string) {
    return this.accounts.find((account) => account.email === email);
  }

  findById(id: string) {
    return this.accounts.find((account) => account.id === id);
  }

  create(createAccountDto: AccountsRepository.CreateAccountDto) {
    const { name, email } = createAccountDto;

    const createdAccount: Account = {
      id: randomUUID(),
      name,
      email,
    };

    this.accounts.push(createdAccount);

    return createdAccount;
  }
}

export namespace AccountsRepository {
  export type CreateAccountDto = {
    name: string;
    email: string;
  };
}
