import { Injectable } from '../../kernel/decorators/Injectable';

@Injectable()
export class AccountsRepository {
  private accounts: Account[] = [];

  findByEmail(email: string) {
    return this.accounts.find((account) => account.email === email);
  }

  findMany() {
    return this.accounts;
  }

  insert(account: Account) {
    this.accounts.push(account);
  }
}

export type Account = {
  id: string;
  name: string;
  email: string;
  password: string;
};
