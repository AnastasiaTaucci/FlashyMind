import express from 'express';
import { router as flashcardsRouter } from './routes/flashcards';
import authRouter from './routes/auth';
import './utils/dbConnect'; // Importing the module will execute the connection logic
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';


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
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use('/api', flashcardsRouter);

app.use('/api/auth', authRouter)


app.get('/', (req, res) => {
  res.send('Hello, Express with TypeScript!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api/docs`);
});
