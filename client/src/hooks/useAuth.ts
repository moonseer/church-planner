import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  churchName: string;
  role: string;
}

export const useAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [resetToken, setResetToken] = useState<string | undefined>(undefined);
  // Remove the hasAttemptedFetch state as we want to check on every page load
  const [tokenCheckComplete, setTokenCheckComplete] = useState(false);

  useEffect(() => {
    // This effect runs on component mount and will check for a token
    console.log('Auth hook initialized, checking for existing token...');
    const checkAuthStatus = async () => {
      try {
        console.log('Attempting to validate session with server...');
        await fetchCurrentUser();
        setTokenCheckComplete(true);
      } catch (error) {
        console.error('Error validating session:', error);
        setIsLoggedIn(false);
        setUserData(null);
        setTokenCheckComplete(true);
      }
    };
    
    checkAuthStatus();
    
    // Set up an event listener for storage changes (in case token is modified in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        console.log('Token changed in another tab, updating auth state');
        if (e.newValue) {
          fetchCurrentUser();
        } else {
          setIsLoggedIn(false);
          setUserData(null);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Empty dependency array means this runs once on mount

  const fetchCurrentUser = async () => {
    try {
      console.log('Fetching current user data from server...');
      
      // Use the authAPI service instead of direct axios call
      const response = await authAPI.getCurrentUser();
      
      console.log('Current user response:', response);
      
      if (response.success) {
        // Ensure the user object has all required properties
        const user = response.user;
        
        // If name is missing but we have firstName/lastName, construct it
        if (!user.name && (user.firstName || user.lastName)) {
          user.name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
        }
        
        // Ensure role is set
        if (!user.role) {
          user.role = 'user';
        }
        
        console.log('User authenticated successfully:', user);
        setIsLoggedIn(true);
        setUserData(user);
      } else {
        // Session is invalid or expired
        console.log('Session invalid or expired');
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      setIsLoggedIn(false);
      setUserData(null);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setMessage('');

    try {
      console.log('Attempting login with:', { email });
      
      // Use the authAPI service instead of direct axios call
      const response = await authAPI.login(email, password);

      console.log('Login response:', response);
      if (response.success) {
        // Ensure the user object has all required properties
        const user = response.user;
        
        // If name is missing but we have firstName/lastName, construct it
        if (!user.name && (user.firstName || user.lastName)) {
          user.name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
        }
        
        // Ensure role is set
        if (!user.role) {
          user.role = 'user';
        }
        
        setMessage('Login successful!');
        setIsLoggedIn(true);
        setUserData(user);
        localStorage.setItem('token', response.token);
      } else {
        setMessage(response.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (firstName: string, lastName: string, email: string, password: string, churchName: string) => {
    setIsLoading(true);
    setMessage('');

    try {
      console.log('Attempting registration with:', { firstName, lastName, email, churchName });
      
      // Use the authAPI service instead of direct axios call
      const response = await authAPI.register(`${firstName} ${lastName}`, email, password, churchName);

      console.log('Registration response:', response);
      if (response.success) {
        setMessage('Registration successful!');
        setIsLoggedIn(true);
        setUserData(response.user);
        localStorage.setItem('token', response.token);
      } else {
        setMessage('Registration failed: ' + response.message);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        setMessage('Registration failed: ' + (error.response.data.message || error.response.statusText));
      } else if (error.request) {
        console.error('Error request:', error.request);
        setMessage('Registration failed: No response from server. Please check if the server is running.');
      } else {
        console.error('Error message:', error.message);
        setMessage('Registration failed: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    setIsLoading(true);
    setMessage('');

    try {
      // Use the authAPI service instead of direct axios call
      const response = await authAPI.forgotPassword(email);
      
      if (response.success) {
        setMessage('If your email exists in our system, you will receive a password reset link.');
      } else {
        setMessage('Failed to request password reset: ' + response.message);
      }
    } catch (error: any) {
      console.error('Forgot password error:', error);
      setMessage('Failed to request password reset. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (password: string, token: string) => {
    setIsLoading(true);
    setMessage('');

    try {
      // Use the authAPI service instead of direct axios call
      const response = await authAPI.resetPassword(token, password);
      
      if (response.success) {
        setMessage('Your password has been reset successfully. You can now log in with your new password.');
        setResetToken(undefined);
      } else {
        setMessage('Failed to reset password: ' + response.message);
      }
    } catch (error: any) {
      console.error('Reset password error:', error);
      setMessage('Failed to reset password. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserData(null);
    setMessage('Logged out successfully');
  };

  return {
    isLoggedIn,
    userData,
    isLoading,
    message,
    resetToken,
    tokenCheckComplete,
    handleLogin,
    handleRegister,
    handleLogout,
    handleForgotPassword,
    handleResetPassword
  };
}; 