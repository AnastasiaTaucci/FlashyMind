import express from 'express';
import authRouter from './routes/auth';
import swaggerJsdoc from 'swagger-jsdoc';
import flashcardDecksRoutes from './routes/flashcardDecksRoutes';
import flashcardsRoutes from './routes/flashcards';
import { authenticateUser } from './middlewares/authMiddleware';
import paginationMiddleware from './middlewares/pagination';
import cors from 'cors';
import detailedQuizResultRoutes from './routes/detailedQuizResultRoutes';
import quizRoutes from './routes/quizRoutes';

const app = express();
app.use(express.json());
const PORT = Number(process.env.PORT) || 3000;

// Logging middleware to show all API calls
app.use((req, res, next) => {
  const start = Date.now();
  
  console.log(`\n🔍 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log(`📝 Headers:`, req.headers);
  console.log(`📦 Body:`, req.body);
  console.log(`🔗 Query:`, req.query);
  console.log(`🆔 Params:`, req.params);
  
  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`✅ [${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
    console.log(`📤 Response:`, res.locals.responseData || 'No response data logged');
    console.log('─'.repeat(80));
  });
  
  next();
});

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
app.use('/api/auth', authRouter);
app.use('/api/flashcard-decks', flashcardDecksRoutes);
app.use('/api/flashcards', authenticateUser, flashcardsRoutes);
app.use('/api/detailed-quiz-results', detailedQuizResultRoutes);
app.use('/api/quizzes', quizRoutes);

app.get('/', (req, res) => {
  res.send('Hello, Express with TypeScript!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
  console.log(`📚 API documentation available at http://localhost:${PORT}/api-docs`);
  console.log(`🔍 Debug mode: All API calls will be logged`);
});
export default app;