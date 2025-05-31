# FlashyMind Backend Documentation

## Overview
The FlashyMind backend is a Node.js/Express application written in TypeScript. It provides RESTful APIs for user authentication (using Supabase), flashcard management, and quiz results. The backend is designed for scalability, security, and easy integration with the FlashyMind frontend.

---

## Table of Contents
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [Auth Endpoints](#auth-endpoints)
  - [Flashcards Endpoints](#flashcards-endpoints)
  - [Flashcard Sets Endpoints](#flashcard-sets-endpoints)
  - [Quiz Results Endpoints](#quiz-results-endpoints)
- [Testing](#testing)
- [Development](#development)
- [Supabase Integration](#supabase-integration)
- [API Documentation (Swagger)](#api-documentation-swagger)

---

## Project Structure
```
backend/
  src/
    controllers/      # Route handler logic (auth, flashcards, etc.)
    models/           # Mongoose models for MongoDB
    routes/           # Express route definitions
    utils/            # Utility modules (Supabase client, DB connect)
    types/            # TypeScript type definitions
    index.ts          # Main Express app entry point
  tests/              # Jest test files (integration/unit)
  package.json        # Project dependencies and scripts
  tsconfig.json       # TypeScript configuration
  .env                # Environment variables
```

---

## Environment Variables
Set these in `backend/.env`:

```
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
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
  - **Response:** `{ user: { ... } }` on success, `{ error: string }` on failure

- `POST /api/auth/login`  
  Authenticates a user and returns a session and user object.
  - **Body:** `{ email: string, password: string }`
  - **Response:** `{ session: { ... }, user: { ... } }` on success, `{ error: string }` on failure

### Flashcards Endpoints
- `GET /api/flashcards`  
  Returns all flashcards.
- `POST /api/flashcards`  
  Creates a new flashcard.
- `GET /api/flashcards/:id`  
  Returns a single flashcard by ID.
- `PUT /api/flashcards/:id`  
  Updates a flashcard by ID.
- `DELETE /api/flashcards/:id`  
  Deletes a flashcard by ID.

### Flashcard Sets Endpoints
- `GET /api/flashcardSets`  
  Returns all flashcard sets.
- `POST /api/flashcardSets`  
  Creates a new flashcard set.
- `GET /api/flashcardSets/:id`  
  Returns a single flashcard set by ID.
- `PUT /api/flashcardSets/:id`  
  Updates a flashcard set by ID.
- `DELETE /api/flashcardSets/:id`  
  Deletes a flashcard set by ID.

### Quiz Results Endpoints
- `GET /api/quizResults`  
  Returns all quiz results.
- `POST /api/quizResults`  
  Creates a new quiz result.

---

## Testing
- Tests are written with Jest and Supertest.
- Supabase authentication is mocked in tests for fast, safe, and reliable CI.
- Run tests from the backend directory:
  ```bash
  cd backend
  npx jest
  ```

---

## Development
- Start the backend in development mode:
  ```bash
  npm run dev
  ```
- Build for production:
  ```bash
  npm run build
  npm start
  ```
- The main entry point is `src/index.ts`.

---

## Supabase Integration
- Supabase is used for user authentication (signup, login).
- The Supabase client is initialized in `src/utils/supabaseClient.ts` using credentials from `.env`.
- All authentication logic is handled in `src/controllers/authController.ts`.
- For local development and testing, Supabase methods are mocked in Jest tests to avoid creating real users.

---

## API Documentation (Swagger)
- Interactive API documentation is available via Swagger UI.
- After starting the backend, visit: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- The documentation is auto-generated from JSDoc comments in the controller files.
- You can try out endpoints, view request/response schemas, and see example payloads directly in the browser.

---

## Notes
- Ensure your Supabase project allows email/password signups and logins.
- For production, secure your environment variables and never commit secrets.
- For more details, see the code comments and each module's documentation.
