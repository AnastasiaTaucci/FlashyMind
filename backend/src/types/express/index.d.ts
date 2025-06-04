// types/express.d.ts
import { Request as ExpressRequest } from 'express';
import { User } from '@supabase/supabase-js';

export interface CustomRequest extends ExpressRequest {
  user?: User;
  pagination?: {
    page?: number;
    limit?: number;
  };
}

// Global augmentation as backup
declare global {
  namespace Express {
    interface Request {
      user?: User;
      pagination?: {
        page?: number;
        limit?: number;
      };
    }
  }
}