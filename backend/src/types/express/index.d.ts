import { User } from '@supabase/supabase-js';
import { Request } from 'express';
export interface CustomRequest extends Request {
  user?: User;
  pagination?: {
    page?: number;
    limit?: number;
  };
}

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

export { };
