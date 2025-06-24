# FlashyMind Backend Deployment Plan

This document provides detailed deployment instructions for the FlashyMind backend API, including multiple deployment platforms and configurations.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Deployment Platforms](#deployment-platforms)
4. [Environment Configuration](#environment-configuration)
5. [Build Process](#build-process)
6. [Database Setup](#database-setup)
7. [Security Configuration](#security-configuration)
8. [Monitoring & Logging](#monitoring--logging)
9. [CI/CD Pipeline](#cicd-pipeline)
10. [Troubleshooting](#troubleshooting)

---

## 🏗️ Overview

The FlashyMind backend is a Node.js/Express.js API built with TypeScript that provides:
- User authentication via Supabase
- Flashcard deck management
- Quiz functionality
- Progress tracking
- RESTful API endpoints

**Tech Stack:**
- Node.js 18+
- Express.js 5.x
- TypeScript
- Supabase (PostgreSQL)
- JWT Authentication
- Swagger Documentation

---

## ✅ Prerequisites

### Required Tools
```bash
# Node.js (v18 or higher)
node --version

# npm or yarn
npm --version

# Git
git --version

# Vercel CLI (for Vercel deployment)
npm install -g vercel

# Railway CLI (for Railway deployment)
npm install -g @railway/cli
```

### Required Accounts
- **Supabase Account**: For database and authentication
- **Vercel Account**: For deployment (recommended)
- **GitHub Account**: For version control and CI/CD
- **Railway Account**: Alternative deployment platform

---

## 🚀 Deployment Platforms

### Option 1: Vercel (Recommended)

#### Setup
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from backend directory
cd backend
vercel --prod
```

#### Configuration Files

**`vercel.json`**:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "dist/index.js"
    },
    {
      "src": "/api-docs",
      "dest": "dist/index.js"
    },
    {
      "src": "/health",
      "dest": "dist/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "dist/index.js": {
      "maxDuration": 30
    }
  }
}
```

**Updated `package.json` scripts**:
```json
{
  "scripts": {
    "start": "node dist/index.js",
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "vercel-build": "npm run build",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint 'src/**/*.{ts,tsx}'",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\""
  }
}
```

### Option 2: Railway

#### Setup
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize Railway project
railway init

# Deploy
railway up
```

#### Configuration

**`railway.json`**:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Option 3: Render

#### Setup
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Configure build settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node

#### Configuration

**`render.yaml`**:
```yaml
services:
  - type: web
    name: flashymind-api
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
    healthCheckPath: /health
    autoDeploy: true
```

### Option 4: DigitalOcean App Platform

#### Setup
1. Create a new App in DigitalOcean
2. Connect your GitHub repository
3. Configure build settings:
   - **Build Command**: `npm install && npm run build`
   - **Run Command**: `npm start`
   - **Environment**: Node.js

---

## ⚙️ Environment Configuration

### Environment Variables

#### Production Environment
```env
# Application
NODE_ENV=production
PORT=3000

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=https://your-frontend-domain.vercel.app

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Optional: Redis for caching
REDIS_URL=redis://localhost:6379
```

#### Development Environment
```env
# Application
NODE_ENV=development
PORT=3000

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# JWT Configuration
JWT_SECRET=dev_jwt_secret
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug
LOG_FILE=logs/dev.log

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
```

### Environment Setup Script
```bash
#!/bin/bash
# scripts/setup-env.sh

echo "Setting up FlashyMind backend environment..."

# Create environment file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env file from .env.example"
fi

# Create logs directory
mkdir -p logs

# Install dependencies
npm install

# Build the application
npm run build

echo "Environment setup complete!"
echo "Please update .env file with your actual values."
```

---

## 🔨 Build Process

### TypeScript Configuration

**`tsconfig.json`**:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### Build Scripts

**Enhanced `package.json`**:
```json
{
  "scripts": {
    "start": "node dist/index.js",
    "dev": "nodemon --exec ts-node src/index.ts",
    "debug": "nodemon --inspect --exec \"node -r ts-node/register src/index.ts\"",
    "build": "tsc",
    "build:clean": "rm -rf dist && npm run build",
    "vercel-build": "npm run build",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "npm run test -- --ci --coverage --watchAll=false",
    "lint": "eslint 'src/**/*.{ts,tsx}'",
    "lint:fix": "eslint 'src/**/*.{ts,tsx}' --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "type-check": "tsc --noEmit",
    "prebuild": "npm run type-check",
    "postbuild": "npm run test:ci"
  }
}
```

---

## 🗄️ Database Setup

### Supabase Configuration

#### 1. Database Schema
```sql
-- Users table (handled by Supabase Auth)
-- No additional setup needed

-- Flashcard Decks
CREATE TABLE flashcard_decks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  subject VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Flashcards
CREATE TABLE flashcards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deck_id UUID REFERENCES flashcard_decks(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz Results
CREATE TABLE quiz_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  deck_id UUID REFERENCES flashcard_decks(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  time_taken INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies
ALTER TABLE flashcard_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Policies for flashcard_decks
CREATE POLICY "Users can view their own decks" ON flashcard_decks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own decks" ON flashcard_decks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own decks" ON flashcard_decks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own decks" ON flashcard_decks
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for flashcards
CREATE POLICY "Users can view flashcards from their decks" ON flashcards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM flashcard_decks 
      WHERE flashcard_decks.id = flashcards.deck_id 
      AND flashcard_decks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert flashcards to their decks" ON flashcards
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM flashcard_decks 
      WHERE flashcard_decks.id = flashcards.deck_id 
      AND flashcard_decks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update flashcards from their decks" ON flashcards
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM flashcard_decks 
      WHERE flashcard_decks.id = flashcards.deck_id 
      AND flashcard_decks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete flashcards from their decks" ON flashcards
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM flashcard_decks 
      WHERE flashcard_decks.id = flashcards.deck_id 
      AND flashcard_decks.user_id = auth.uid()
    )
  );

-- Policies for quiz_results
CREATE POLICY "Users can view their own quiz results" ON quiz_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz results" ON quiz_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

#### 2. Database Connection
```typescript
// src/utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
```

---

## 🔒 Security Configuration

### Security Middleware

```typescript
// src/middlewares/security.ts
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cors from 'cors'

export const securityMiddleware = [
  // Security headers
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }),

  // CORS configuration
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }),

  // Rate limiting
  rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP
    message: {
      error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  })
]
```

### JWT Configuration

```typescript
// src/utils/jwt.ts
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export const generateToken = (payload: any): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    throw new Error('Invalid token')
  }
}
```

---

## 📊 Monitoring & Logging

### Logging Configuration

```typescript
// src/utils/logger.ts
import winston from 'winston'

const logLevel = process.env.LOG_LEVEL || 'info'
const logFile = process.env.LOG_FILE || 'logs/app.log'

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'flashymind-api' },
  transports: [
    new winston.transports.File({ 
      filename: logFile, 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: logFile.replace('.log', '-combined.log') 
    })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }))
}

export default logger
```

### Health Check Endpoint

```typescript
// src/routes/health.ts
import { Router } from 'express'
import { supabase } from '../utils/supabaseClient'

const router = Router()

router.get('/health', async (req, res) => {
  try {
    // Check database connection
    const { data, error } = await supabase
      .from('flashcard_decks')
      .select('count')
      .limit(1)

    if (error) {
      return res.status(503).json({
        status: 'error',
        message: 'Database connection failed',
        error: error.message
      })
    }

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0'
    })
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

export default router
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/backend-deploy.yml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths: ['backend/**']
  pull_request:
    branches: [main]
    paths: ['backend/**']

jobs:
  test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./backend
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: './backend/package-lock.json'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run tests
        run: npm run test:ci
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
          JWT_SECRET: ${{ secrets.JWT_SECRET }}

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    defaults:
      run:
        working-directory: ./backend
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_BACKEND_PROJECT_ID }}
          vercel-args: '--prod'
```

### Required Secrets
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `JWT_SECRET`: Your JWT secret key
- `VERCEL_TOKEN`: Your Vercel API token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_BACKEND_PROJECT_ID`: Your Vercel backend project ID

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Check TypeScript compilation
npm run type-check

# Check for linting errors
npm run lint

# Clean build
npm run build:clean
```

#### 2. Environment Variables
```bash
# Verify environment variables are set
node -e "console.log(process.env.NODE_ENV)"
node -e "console.log(process.env.SUPABASE_URL)"

# Check Vercel environment variables
vercel env ls
```

#### 3. Database Connection Issues
```bash
# Test Supabase connection
curl -X GET "https://your-project.supabase.co/rest/v1/flashcard_decks?select=count" \
  -H "apikey: your_anon_key" \
  -H "Authorization: Bearer your_anon_key"
```

#### 4. CORS Issues
```bash
# Check CORS configuration
curl -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: X-Requested-With" \
  -X OPTIONS \
  https://your-api-domain.vercel.app/api/health
```

### Debug Commands

```bash
# Run in debug mode
npm run debug

# Check logs
tail -f logs/app.log

# Monitor API endpoints
curl -X GET https://your-api-domain.vercel.app/health

# Check deployment status
vercel ls
```

### Performance Monitoring

```bash
# Monitor response times
curl -w "@curl-format.txt" -o /dev/null -s "https://your-api-domain.vercel.app/api/health"

# Check memory usage
node -e "console.log(process.memoryUsage())"

# Monitor CPU usage
top -p $(pgrep -f "node.*dist/index.js")
```

---

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] TypeScript compilation successful
- [ ] Linting passed
- [ ] Environment variables configured
- [ ] Database schema updated
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Health check endpoint working

### Deployment
- [ ] Build successful
- [ ] Deployment completed
- [ ] Health check passing
- [ ] Environment variables set correctly
- [ ] CORS configuration updated
- [ ] SSL certificate valid
- [ ] Domain configured

### Post-Deployment
- [ ] API endpoints responding
- [ ] Authentication working
- [ ] Database connections stable
- [ ] Monitoring active
- [ ] Error tracking configured
- [ ] Performance metrics normal
- [ ] Documentation updated

---

## 🚀 Quick Deploy Commands

### Vercel (Recommended)
```bash
cd backend
vercel --prod
```

### Railway
```bash
cd backend
railway up
```

### Manual Build & Deploy
```bash
cd backend
npm run build
npm start
```

---

*This deployment plan should be updated as the backend evolves and new requirements are added.* 