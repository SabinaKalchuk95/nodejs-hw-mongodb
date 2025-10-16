import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { getEnv } from './utils/env.js'; 
import { initMongoConnection } from './db/initMongoConnection.js';
import { errorHandler } from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js'; 
import contactsRouter from './routes/contacts.js';
import authRouter from './routes/auth.js';
import { ContactsCollection } from './db/models/contacts.js'; // ✅ ДОДАНО: Імпорт колекції для синхронізації індексів

const PORT = getEnv('PORT', '3000');

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser()); 

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

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