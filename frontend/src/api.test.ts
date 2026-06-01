import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { api, getToken, setToken, clearToken } from './api';

describe('API Utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Token management', () => {
    it('sets and gets the token correctly', () => {
      setToken('test-token');
      expect(getToken()).toBe('test-token');
    });

    it('clears the token correctly', () => {
      setToken('test-token');
      clearToken();
      expect(getToken()).toBeNull();
    });
  });

  describe('Auth functionality', () => {
    it('registers a user successfully', async () => {
      const response = await api.register('test@example.com', 'password123', 'Test User');
      expect(response.access_token).toBeDefined();
      expect(getToken()).toBeNull(); // It does not set token automatically in api.ts, auth.tsx does it. Wait, api.ts returns the token.
    });

    it('prevents registering with an existing email', async () => {
      await api.register('test@example.com', 'password123', 'Test User');
      await expect(api.register('test@example.com', 'newpass', 'User 2')).rejects.toThrow('Email already in use');
    });

    it('logs in a user successfully', async () => {
      await api.register('login@example.com', 'password123', 'Login User');
      const response = await api.login('login@example.com', 'password123');
      expect(response.access_token).toBeDefined();
    });

    it('rejects invalid login', async () => {
      await expect(api.login('wrong@example.com', 'password')).rejects.toThrow('Invalid email or password');
    });
  });
});
