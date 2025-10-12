import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // ❗ КРИТИЧНОЕ ИСПРАВЛЕНИЕ
import { getEnv } from './utils/env.js'; 
import { initMongoConnection } from './db/initMongoConnection.js';
import { errorHandler } from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js'; 
import contactsRouter from './routes/contacts.js';
import authRouter from './routes/auth.js';

const PORT = getEnv('PORT', '3000');

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser()); // ❗ КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Добавлен cookie-parser

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // ❗ ИСПРАВЛЕНИЕ: Добавлены префиксы /auth и /contacts
  app.use('/auth', authRouter); 
  app.use('/contacts', contactsRouter); 

  app.use('*', notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

(async () => {
  await initMongoConnection();
  setupServer();
})();