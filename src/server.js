import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routes/contactsRouter.js';

export const setupServer = () => {
    const app = express();
    const logger = pino();

    app.use(cors());
    app.use(logger);
    app.use(express.json());

    app.use('/contacts', contactsRouter);

    // 404 handler з логуванням
    app.use((req, res) => {
        logger.logger.warn(`404 Not Found: ${req.method} ${req.url}`);
        res.status(404).json({ message: 'Not found' });
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
