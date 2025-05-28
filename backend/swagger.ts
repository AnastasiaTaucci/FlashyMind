import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Flashcards API',
      version: '1.0.0',
      description: 'API documentation for Flashcards and Quiz App',
      components: {
        schemas: {
          Flashcard: {
            type: 'object',
            properties: {
              subject: { type: 'string' },
              topic: { type: 'string' },
              question: { type: 'string' },
              answer: { type: 'string' },
            },
            required: ['subject', 'topic', 'question', 'answer'],
          },
        },
      },
    },
  },
  apis: ['./routes/*.ts'], // Path to your API routes
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwaggerDocs = (app: Express, port: number) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
};
