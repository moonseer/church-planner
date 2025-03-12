import { useState, useEffect } from 'react';
import axios from 'axios';

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

  // API base URL
  const API_URL = 'http://localhost:8080/api';

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      // Attempt to get user data with the token
      fetchCurrentUser(token);
    }
  }, []);

  const fetchCurrentUser = async (token: string) => {
    try {
      console.log('Fetching current user with token:', token);
      
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Current user response:', response.data);
      
      if (response.data.success) {
        // Ensure the user object has all required properties
        const user = response.data.user;
        
        // If name is missing but we have firstName/lastName, construct it
        if (!user.name && (user.firstName || user.lastName)) {
          user.name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
        }
        
        // Ensure role is set
        if (!user.role) {
          user.role = 'user';
        }
        
        setIsLoggedIn(true);
        setUserData(user);
      } else {
        // Token is invalid or expired
        console.log('Token invalid or expired');
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      setUserData(null);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setMessage('');

    try {
      console.log('Attempting login with:', { email, password });
      
      // First, try a simple fetch to check if the server is reachable
      try {
        const healthCheck = await fetch('http://localhost:8080/health');
        console.log('Health check response:', await healthCheck.text());
      } catch (healthError) {
        console.error('Health check failed:', healthError);
      }
      
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      console.log('Login response:', response.data);
      if (response.data.success) {
        // Ensure the user object has all required properties
        const user = response.data.user;
        
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
        localStorage.setItem('token', response.data.token);
      } else {
        setMessage(response.data.message || 'Login failed. Please check your credentials.');
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
      
      // First, try a simple fetch to check if the server is reachable
      try {
        const healthCheck = await fetch('http://localhost:8080/health');
        console.log('Health check response:', await healthCheck.text());
      } catch (healthError) {
        console.error('Health check failed:', healthError);
      }
      
      const response = await axios.post(`${API_URL}/auth/register`, {
        name: `${firstName} ${lastName}`, // Combine for the name field
        firstName,
        lastName,
        email,
        password,
        churchName
      });

      console.log('Registration response:', response.data);
      if (response.data.success) {
        setMessage('Registration successful!');
        setIsLoggedIn(true);
        setUserData(response.data.user);
        localStorage.setItem('token', response.data.token);
      } else {
        setMessage('Registration failed: ' + response.data.message);
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
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      
      if (response.data.success) {
        setMessage('If your email exists in our system, you will receive a password reset link.');
      } else {
        setMessage('Failed to request password reset: ' + response.data.message);
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
      const response = await axios.post(`${API_URL}/auth/reset-password`, { 
        password,
        token
      });
      
      if (response.data.success) {
        setMessage('Your password has been reset successfully. You can now log in with your new password.');
        setResetToken(undefined);
      } else {
        setMessage('Failed to reset password: ' + response.data.message);
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
    handleLogin,
    handleRegister,
    handleLogout,
    handleForgotPassword,
    handleResetPassword
  };
}; 