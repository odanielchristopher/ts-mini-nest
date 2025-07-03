import express from 'express';

import { IServer } from '../../../shared/contracts/Server';

import { Routes } from './routes/Routes';

export class ExpressServer implements IServer {
  private readonly app = express();
  private readonly routes = new Routes();

  constructor() {}

  setupServer() {
    this.app.use(express.json());
    this.app.use(this.routes.setup());
  }

  async listen(port: number, callback: (param?: any) => void): Promise<void> {
    this.app.listen(port, callback);
  }
}
