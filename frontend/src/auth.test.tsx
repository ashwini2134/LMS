import { render, screen, act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from './auth';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

const TestComponent = () => {
  const { user, ready, login, logout, register } = useAuth();
  
  if (!ready) return <div>Loading...</div>;
  
  return (
    <div>
      <div data-testid="user-status">{user ? user.name : 'No User'}</div>
      <button onClick={() => login('test@example.com', 'password123')}>Login</button>
      <button onClick={() => logout()}>Logout</button>
      <button onClick={() => register('test@example.com', 'password123', 'Test User')}>Register</button>
    </div>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    cleanup();
  });

  it('renders children and provides auth context', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Initial state
    expect(await screen.findByText('No User')).toBeDefined();
  });

  it('handles registration', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const registerBtn = await screen.findByText('Register');
    await act(async () => {
      await user.click(registerBtn);
    });

    expect(await screen.findByText('Test User')).toBeDefined();
  });
  
  it('handles logout', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const registerBtn = await screen.findByText('Register');
    await act(async () => {
      await user.click(registerBtn);
    });
    expect(await screen.findByText('Test User')).toBeDefined();

    const logoutBtn = await screen.findByText('Logout');
    await act(async () => {
      await user.click(logoutBtn);
    });
    
    expect(await screen.findByText('No User')).toBeDefined();
  });
});

