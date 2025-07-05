export interface IServer {
  setupServer(): void;
  listen(port: number, callback: (param?: any) => void): Promise<void>;
}
