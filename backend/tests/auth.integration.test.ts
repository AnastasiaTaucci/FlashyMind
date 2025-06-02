import request from 'supertest';
import app from '../src/index'; // adjust path if needed
import supabase from '../src/utils/supabaseClient';

import dotenv from 'dotenv';
dotenv.config();

const admin = supabase.auth.admin;

const testEmail = 'degerahmet.dev@gmail.com';
const testPassword = 'StrongTestPassword123!';

describe('Auth Integration Tests', () => {
  beforeAll(async () => {
    // Clean up test user if exists
    const { data: { users } } = await admin.listUsers();
    if (users && users.length > 0) {
      await admin.deleteUser(users[0].id);
    }
  });

  afterAll(async () => {
    // Clean up test user after tests
    const { data: { users } } = await admin.listUsers();
    if (users && users.length > 0) {
      await admin.deleteUser(users[0].id);
    }
  });

  it('should fail to sign up with the same email again', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: testEmail, password: testPassword });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should log in with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: testPassword });

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(testEmail);
    expect(res.body).toHaveProperty('access_token');
  });

  it('should fail to log in with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: 'WrongPassword!' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});
