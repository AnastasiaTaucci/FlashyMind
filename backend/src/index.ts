import express from 'express';
import authRouter from './routes/auth';
import swaggerJsdoc from 'swagger-jsdoc';
import flashcardDecksRoutes from './routes/flashcardDecksRoutes';
import paginationMiddleware from './middlewares/pagination';
import cors from 'cors';

const app = express();
app.use(express.json());
const PORT = Number(process.env.PORT) || 3000;


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


app.use(cors());
app.use('/api/auth', authRouter)
app.use('/api/flashcard-decks', paginationMiddleware, flashcardDecksRoutes);


app.get('/', (req, res) => {
  res.send('Hello, Express with TypeScript!');
});

// app.listen(PORT, () => {
//   console.log(`🚀 Server is running on port ${PORT}`);
//   console.log(`📚 API documentation available at http://localhost:${PORT}/api-docs`);
// });

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
export default app;