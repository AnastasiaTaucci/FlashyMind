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
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        FlashcardDeck: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            subject: { type: 'string' },
            description: { type: 'string' },
            flashcards: {
              type: 'array',
              items: {
                $ref: 'controllers/flashcards/flashcardController.ts',
              },
            },
            createdBy: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
          required: ['id', 'title', 'subject', 'flashcards'],
        },
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
        AddDeckRequestBody: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            subject: { type: 'string' },
            description: { type: 'string' },
          },
          required: ['title', 'subject'],
        },
        UpdateDeckRequestBody: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            subject: { type: 'string' },
            description: { type: 'string' },
          },
          required: ['id', 'title', 'subject'],
        },
        DeleteDeckRequestBody: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/**/*.ts', './src/controllers/**/*.ts'], // ensure this matches actual folder structure
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwaggerDocs = (app: Express, port: number) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
