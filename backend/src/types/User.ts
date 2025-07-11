export interface User {
  instance_id: string;
  id: string;
  aud: string;
  role: string;
  email: string;
  encrypted_password: string;
  email_confirmed_at?: string;
  invited_at?: string;
  confirmation_token?: string;
  confirmation_sent_at?: string;
  recovery_token?: string;
  recovery_sent_at?: string;
  email_change_token_new?: string;
  email_change?: string;
  email_change_sent_at?: string;
  last_sign_in_at?: string;
  raw_app_meta_data: Record<string, any>;
  raw_user_meta_data: Record<string, any>;
  is_super_admin: boolean;
  created_at: string;
  updated_at: string;
  phone?: string;
  phone_confirmed_at?: string;
  phone_change?: string;
  phone_change_token?: string;
  phone_change_sent_at?: string;
  confirmed_at?: string;
  email_change_token_current?: string;
  email_change_confirm_status?: number;
  banned_until?: string;
  reauthentication_token?: string;
  reauthentication_sent_at?: string;
  is_sso_user: boolean;
  deleted_at?: string;
  is_anonymous: boolean;
} 