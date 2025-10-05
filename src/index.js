import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

import { getEnv } from './utils/env.js'; 

import notFoundHandler from './middlewares/notFoundHandler.js'; 
import { errorHandler } from './middlewares/errorHandler.js'; 

import { initMongoConnection } from './db/initMongoConnection.js';

import authRouter from './routes/auth.js';
import contactsRouter from './routes/contacts.js';

const PORT = Number(getEnv('PORT', '3000')); 

export const setupServer = () => {
  const app = express();

  initMongoConnection(); 

  app.use(cors());
  app.use(express.json()); 
  
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use('/api/auth', authRouter);
  app.use('/api/contacts', contactsRouter);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

setupServer();