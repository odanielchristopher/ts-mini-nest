import { randomUUID } from 'node:crypto';

import { Injectable } from '../../kernel/decorators/Injectable';
import {
  Account,
  AccountsRepository,
} from '../repositories/AccountsRepository';

@Injectable()
export class AccountsService {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  findAll() {
    return this.accountsRepository.findMany();
  }

  createAccount(input: AccountsService.CreateAccountInput) {
    const { name, email, password } = input;

    const emailAlreadyExists = this.accountsRepository.findByEmail(email);

    if (emailAlreadyExists) {
      throw new Error('Email already in use!');
    }

    const account: Account = {
      id: randomUUID(),
      name,
      email,
      password,
    };

    this.accountsRepository.insert(account);

    return account;
  }
}

export namespace AccountsService {
  export type CreateAccountInput = {
    name: string;
    email: string;
    password: string;
  };
}
