import express from 'express';
import authRouter from './routes/auth';
import swaggerJsdoc from 'swagger-jsdoc';
import flashcardDecksRoutes from './routes/flashcardDecksRoutes';
import paginationMiddleware from './middlewares/pagination';


const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;


// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FlashyMind API',
      version: '1.0.0',
      description: 'API documentation for FlashyMind backend',
    },
  },
  apis: ['./src/controllers/*.ts'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

import { setupSwaggerDocs } from './utils/swagger';

setupSwaggerDocs(app, Number(3000));



app.use('/api/auth', authRouter)
app.use('/api/flashcard-decks', paginationMiddleware, flashcardDecksRoutes);


app.get('/', (req, res) => {
  res.send('Hello, Express with TypeScript!');
});

app.listen(PORT, () => {
});

export default app;