import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { PORT } from './utils/env.js';
import contactsRouter from './routes/contacts.js';
import authRouter from './routes/auth.js'; 
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());
  
  app.use(pino({
    transport: {
      target: 'pino-pretty',
    },
  }));

  app.use('/api/auth', authRouter); 
  app.use('/api/contacts', contactsRouter);

  app.use((req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });


  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};