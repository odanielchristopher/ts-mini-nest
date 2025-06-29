export interface IServer {
  startServer(): void;
  listen(port: number, callback: (param?: any) => void): Promise<void>;
}
