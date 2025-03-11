import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginForm from '../LoginForm';

describe('LoginForm Component', () => {
  const mockOnLogin = vi.fn();
  
  beforeEach(() => {
    // Reset mock function
    mockOnLogin.mockReset();
  });
  
  it('renders login form correctly', () => {
    render(<LoginForm onLogin={mockOnLogin} />);
    
    // Check if form elements are rendered
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });
  
  it('validates email field', async () => {
    render(<LoginForm onLogin={mockOnLogin} />);
    
    // Get form elements
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    // Enter invalid email and submit
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });
    
    // Check that onLogin was not called
    expect(mockOnLogin).not.toHaveBeenCalled();
  });
  
  it('validates password field', async () => {
    render(<LoginForm onLogin={mockOnLogin} />);
    
    // Get form elements
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    // Enter valid email but no password
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '' } });
    fireEvent.click(submitButton);
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
    
    // Check that onLogin was not called
    expect(mockOnLogin).not.toHaveBeenCalled();
  });
  
  it('submits form with valid data', async () => {
    render(<LoginForm onLogin={mockOnLogin} />);
    
    // Get form elements
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    // Enter valid data
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Submit form
    fireEvent.click(submitButton);
    
    // Check that onLogin was called with correct data
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
  
  it('displays loading state during submission', async () => {
    // Mock onLogin to return a promise that doesn't resolve immediately
    const delayedMockOnLogin = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<LoginForm onLogin={delayedMockOnLogin} />);
    
    // Get form elements
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    // Enter valid data
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Submit form
    fireEvent.click(submitButton);
    
    // Check for loading state
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    
    // Wait for submission to complete
    await waitFor(() => {
      expect(delayedMockOnLogin).toHaveBeenCalled();
    });
  });
  
  it('displays error message when login fails', async () => {
    // Mock onLogin to reject with an error
    const errorMessage = 'Invalid credentials';
    mockOnLogin.mockRejectedValueOnce(new Error(errorMessage));
    
    render(<LoginForm onLogin={mockOnLogin} />);
    
    // Get form elements
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    // Enter valid data
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Submit form
    fireEvent.click(submitButton);
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    
    // Check that button is re-enabled
    expect(submitButton).not.toBeDisabled();
  });
}); 