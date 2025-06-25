# FlashyMind Backend Documentation

## Overview
The FlashyMind backend is a Node.js/Express application written in TypeScript. It provides RESTful APIs for user authentication (using Supabase), flashcard deck management, individual flashcard management, and quiz results tracking. The backend is designed for scalability, security, and easy integration with the FlashyMind frontend.

---

## Table of Contents
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [Auth Endpoints](#auth-endpoints)
  - [Flashcard Decks Endpoints](#flashcard-decks-endpoints)
  - [Flashcards Endpoints](#flashcards-endpoints)
  - [Quiz Endpoints](#quiz-endpoints)
  - [Detailed Quiz Results Endpoints](#detailed-quiz-results-endpoints)
- [Authentication](#authentication)
- [Testing](#testing)
- [Development](#development)
- [Supabase Integration](#supabase-integration)
- [API Documentation (Swagger)](#api-documentation-swagger)

---

## Project Structure
```
backend/
  src/
    controllers/          # Route handler logic
      authController.ts   # Authentication logic
      flashcards/         # Flashcard-related controllers
        flashcardDecksController.ts
        flashcardsController.ts
      quiz/              # Quiz-related controllers
        detailedQuizResultController.ts
        quizController.ts
    middlewares/         # Express middlewares
      authMiddleware.ts  # JWT authentication
      pagination.ts      # Pagination middleware
    routes/              # Express route definitions
      auth.ts
      flashcardDecksRoutes.ts
      flashcards.ts
      quizRoutes.ts
      detailedQuizResultRoutes.ts
    services/            # Business logic services
    types/               # TypeScript type definitions
    utils/               # Utility modules
      supabaseClient.ts  # Supabase client configuration
      swagger.ts         # Swagger documentation setup
    index.ts             # Main Express app entry point
  tests/                 # Jest test files (integration/unit)
  package.json           # Project dependencies and scripts
  tsconfig.json          # TypeScript configuration
  .env                   # Environment variables
```

---

## Environment Variables
Set these in `backend/.env`:

```
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
PORT=3000
```

For testing login, you can also set:
```
TEST_USER_EMAIL=your-test-user@example.com
TEST_USER_PASSWORD=your-test-password
```

---

## API Endpoints

### Auth Endpoints
- `POST /api/auth/signup`  
  Registers a new user with email and password using Supabase Auth.
  - **Body:** `{ email: string, password: string }`
  - **Response:** `{ user: { id, email }, access_token, refresh_token }` on success

- `POST /api/auth/login`  
  Authenticates a user and returns a session and user object.
  - **Body:** `{ email: string, password: string }`
  - **Response:** `{ user: { id, email }, access_token, refresh_token }` on success

- `POST /api/auth/logout`  
  Logs out the current user.
  - **Response:** `{ message: "Logged out successfully" }`

- `POST /api/auth/refresh`  
  Refreshes the access token using a refresh token.
  - **Body:** `{ refresh_token: string }`
  - **Response:** `{ access_token, refresh_token, user: { id, email } }`

### Flashcard Decks Endpoints
- `GET /api/flashcard-decks`  
  Returns all flashcard decks for the authenticated user (with pagination).
  - **Headers:** `Authorization: Bearer <token>`
  - **Query:** `page`, `limit` (optional)

- `POST /api/flashcard-decks`  
  Creates a new flashcard deck.
  - **Headers:** `Authorization: Bearer <token>`
  - **Body:** `{ title: string, subject: string, description?: string }`

- `POST /api/flashcard-decks/add`  
  Alternative endpoint to create a new flashcard deck.
  - **Headers:** `Authorization: Bearer <token>`
  - **Body:** `{ title: string, subject: string, description?: string }`

- `PUT /api/flashcard-decks/:id`  
  Updates a flashcard deck by ID.
  - **Headers:** `Authorization: Bearer <token>`
  - **Body:** `{ title: string, subject: string, description?: string }`

- `PATCH /api/flashcard-decks/update/:id`  
  Alternative endpoint to update a flashcard deck.
  - **Headers:** `Authorization: Bearer <token>`
  - **Body:** `{ title: string, subject: string, description?: string }`

- `DELETE /api/flashcard-decks/:id`  
  Deletes a flashcard deck by ID.
  - **Headers:** `Authorization: Bearer <token>`

- `DELETE /api/flashcard-decks/delete/:id`  
  Alternative endpoint to delete a flashcard deck.
  - **Headers:** `Authorization: Bearer <token>`

### Flashcards Endpoints
- `GET /api/flashcards`  
  Returns all flashcards for the authenticated user.
  - **Headers:** `Authorization: Bearer <token>`

- `GET /api/flashcards/:deck_id`  
  Returns flashcards by deck ID.
  - **Headers:** `Authorization: Bearer <token>`

- `POST /api/flashcards/add`  
  Creates a new flashcard.
  - **Headers:** `Authorization: Bearer <token>`
  - **Body:** `{ subject: string, topic: string, question: string, answer: string, deck_id?: number }`

- `PUT /api/flashcards/:id`  
  Updates a flashcard by ID.
  - **Headers:** `Authorization: Bearer <token>`
  - **Body:** `{ subject: string, topic: string, question: string, answer: string, deck_id?: number }`

- `DELETE /api/flashcards/:id`  
  Deletes a flashcard by ID.
  - **Headers:** `Authorization: Bearer <token>`

### Quiz Endpoints
- `GET /api/quizzes/quizzes`  
  Returns all quizzes for the authenticated user.
  - **Headers:** `Authorization: Bearer <token>`

- `GET /api/quizzes/quizzes/:id`  
  Returns a single quiz by ID.
  - **Headers:** `Authorization: Bearer <token>`

- `POST /api/quizzes/quizzes`  
  Creates a new quiz.
  - **Headers:** `Authorization: Bearer <token>`

- `PUT /api/quizzes/quizzes/:id`  
  Updates a quiz by ID.
  - **Headers:** `Authorization: Bearer <token>`

- `DELETE /api/quizzes/quizzes/:id`  
  Deletes a quiz by ID.
  - **Headers:** `Authorization: Bearer <token>`

### Detailed Quiz Results Endpoints
- `GET /api/detailed-quiz-results/detailed-quiz-results`  
  Returns all detailed quiz results for the authenticated user.
  - **Headers:** `Authorization: Bearer <token>`

- `GET /api/detailed-quiz-results/detailed-quiz-results/:id`  
  Returns a single detailed quiz result by ID.
  - **Headers:** `Authorization: Bearer <token>`

- `POST /api/detailed-quiz-results/detailed-quiz-results`  
  Creates a new detailed quiz result.
  - **Headers:** `Authorization: Bearer <token>`

- `PUT /api/detailed-quiz-results/detailed-quiz-results/:id`  
  Updates a detailed quiz result by ID.
  - **Headers:** `Authorization: Bearer <token>`

- `DELETE /api/detailed-quiz-results/detailed-quiz-results/:id`  
  Deletes a detailed quiz result by ID.
  - **Headers:** `Authorization: Bearer <token>`

---

## Authentication
- All endpoints (except auth endpoints) require JWT authentication
- Include `Authorization: Bearer <token>` header in requests
- Tokens are obtained from Supabase Auth during login/signup
- Token refresh is handled via `/api/auth/refresh` endpoint

---

## Testing
- Tests are written with Jest and Supertest
- Supabase authentication is mocked in tests for fast, safe, and reliable CI
- Run tests from the backend directory:
  ```bash
  cd backend
  npm test
  npm run test:watch
  npm run test:coverage
  ```

---

## Development
- Start the backend in development mode:
  ```bash
  cd backend
  npm run dev
  ```
- Build for production:
  ```bash
  npm run build
  npm start
  ```
- Debug mode:
  ```bash
  npm run debug
  ```
- The main entry point is `src/index.ts`.

---

## Supabase Integration
- Supabase is used for user authentication (signup, login, logout, token refresh)
- The Supabase client is initialized in `src/utils/supabaseClient.ts` using credentials from `.env`
- All authentication logic is handled in `src/controllers/authController.ts`
- For local development and testing, Supabase methods are mocked in Jest tests to avoid creating real users

---

## API Documentation (Swagger)
- Interactive API documentation is available via Swagger UI
- After starting the backend, visit: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- The documentation is auto-generated from JSDoc comments in the controller files
- You can try out endpoints, view request/response schemas, and see example payloads directly in the browser
- All endpoints are documented with proper authentication requirements and request/response schemas

---

## Data Models

### FlashcardDeck
```typescript
interface FlashcardDeck {
  id: number;
  title: string;
  subject: string;
  description?: string;
  flashcards: Flashcard[];
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
```

### Flashcard
```typescript
interface Flashcard {
  id: number;
  subject: string;
  topic: string;
  question: string;
  answer: string;
  deck_id?: number;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}
```

### QuizResult
```typescript
interface QuizResult {
  id: number;
  quiz_id: number;
  user_id: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  date_taken: string;
}
```

### DetailedQuizResult
```typescript
interface DetailedQuizResult {
  id: number;
  created_at: string;
  user_id: string;
  quiz_result_id: number;
  correct_answers: any; // JSON
  wrong_answers: any; // JSON
}
```

---

## Notes
- Ensure your Supabase project allows email/password signups and logins
- For production, secure your environment variables and never commit secrets
- The backend uses CORS to allow cross-origin requests from the frontend
- All endpoints return appropriate HTTP status codes and error messages
- For more details, see the code comments and each module's documentation
