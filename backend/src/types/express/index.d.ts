import { User } from '@supabase/supabase-js';

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

export {}; // ✅ Required to treat as a module
