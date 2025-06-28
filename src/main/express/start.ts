import express from 'express';

import { createRoutes } from './routes';

export function startExpress() {
  const app = express();
  app.use(express.json());
  app.use(createRoutes());

  app.listen(3001, () => {
    // eslint-disable-next-line no-console
    console.log('🚀 Server is running on http://localhost:3001');
  });
}
