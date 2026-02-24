import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { renderWithProviders } from '../../test/utils';
import Login from './index';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { useLoginMutation } from '../../app/api/apiSlice';
vi.mock('../../app/api/apiSlice', async () => {
  const actual = await vi.importActual('../../app/api/apiSlice') as typeof import('../../app/api/apiSlice');
  return {
    ...actual,
    useLoginMutation: vi.fn(),
  };
});

describe('Login page', () => {
  const mockLoginTrigger = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockLoginTrigger.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({ token: '123' }),
    });
    (useLoginMutation as any).mockReturnValue([mockLoginTrigger, { isLoading: false }]);
  });

  it('renders login form', () => {
    renderWithProviders(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('submits form with username and password', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(mockLoginTrigger).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123',
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  it('displays error message on login failure', async () => {
    const user = userEvent.setup();
    mockLoginTrigger.mockReturnValue({
      unwrap: vi.fn().mockRejectedValue({ data: { message: 'Invalid credentials' } }),
    });

    renderWithProviders(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    await user.type(screen.getByLabelText(/username/i), 'wrong');
    await user.type(screen.getByLabelText(/password/i), 'wrong');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
    expect(screen.getByText(/login_error/i)).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});