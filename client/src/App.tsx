import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Calendar from './components/Calendar';
import StatsWidget from './components/StatsWidget';
import UpcomingServicesWidget from './components/UpcomingServicesWidget';
import QuickActionsWidget from './components/QuickActionsWidget';
import AuthPage from './pages/AuthPage';

function App() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Test User');
  const [churchName, setChurchName] = useState('Test Church');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [activePage, setActivePage] = useState('dashboard');
  const [resetToken, setResetToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      // Attempt to get user data with the token
      fetchCurrentUser(token);
    }
  }, []);

  // Debug user data whenever it changes
  useEffect(() => {
    console.log('Current userData state:', userData);
  }, [userData]);

  const fetchCurrentUser = async (token: string) => {
    try {
      console.log('Fetching current user with token:', token);
      
      // Use the server service name and new port
      const apiUrl = 'http://localhost:8080/api';
      
      const response = await axios.get(`${apiUrl}/auth/me`, {
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
      
      const response = await axios.post('http://localhost:8080/api/auth/login', {
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

  const handleRegister = async (name: string, email: string, password: string, churchName: string) => {
    setIsLoading(true);
    setMessage('');

    try {
      console.log('Attempting registration with:', { name, email, password, churchName });
      
      // First, try a simple fetch to check if the server is reachable
      try {
        const healthCheck = await fetch('http://localhost:8080/health');
        console.log('Health check response:', await healthCheck.text());
      } catch (healthError) {
        console.error('Health check failed:', healthError);
      }
      
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        name,
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
      const response = await axios.post('http://localhost:8080/api/auth/forgot-password', { email });
      
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
      const response = await axios.post('http://localhost:8080/api/auth/reset-password', { 
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

  const handleNavigate = (page: string) => {
    setActivePage(page);
  };

  // Sample data for dashboard widgets
  const sampleEvents = [
    {
      id: '1',
      title: 'Sunday Service',
      start: new Date(2024, 2, 10, 10, 0),
      end: new Date(2024, 2, 10, 12, 0),
      type: 'service' as const,
    },
    {
      id: '2',
      title: 'Prayer Meeting',
      start: new Date(2024, 2, 12, 18, 30),
      end: new Date(2024, 2, 12, 20, 0),
      type: 'meeting' as const,
    },
    {
      id: '3',
      title: 'Youth Group',
      start: new Date(2024, 2, 14, 19, 0),
      end: new Date(2024, 2, 14, 21, 0),
      type: 'service' as const,
    },
  ];

  const sampleStats = [
    { id: '1', label: 'Attendance', value: 120, change: 5, changeType: 'increase' as const },
    { id: '2', label: 'Volunteers', value: 25, change: 2, changeType: 'increase' as const },
    { id: '3', label: 'New Visitors', value: 8, change: 3, changeType: 'increase' as const },
    { id: '4', label: 'Donations', value: '$3,250', change: 10, changeType: 'increase' as const },
  ];

  const sampleServices = [
    {
      id: '1',
      name: 'Sunday Morning Service',
      title: 'Sunday Morning Service',
      date: new Date(2024, 2, 10),
      time: '10:00 AM',
      location: 'Main Sanctuary',
      volunteers: 12,
      status: 'published' as const,
    },
    {
      id: '2',
      name: 'Wednesday Bible Study',
      title: 'Wednesday Bible Study',
      date: new Date(2024, 2, 13),
      time: '7:00 PM',
      location: 'Fellowship Hall',
      volunteers: 5,
      status: 'published' as const,
    },
    {
      id: '3',
      name: 'Youth Service',
      title: 'Youth Service',
      date: new Date(2024, 2, 14),
      time: '6:30 PM',
      location: 'Youth Room',
      volunteers: 8,
      status: 'draft' as const,
    },
  ];

  const sampleActions = [
    {
      id: '1',
      name: 'Create Service',
      label: 'Create Service',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>,
      onClick: () => console.log('Create Service clicked'),
    },
    {
      id: '2',
      name: 'Add Volunteer',
      label: 'Add Volunteer',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" /></svg>,
      onClick: () => console.log('Add Volunteer clicked'),
    },
    {
      id: '3',
      name: 'Add Song',
      label: 'Add Song',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" /></svg>,
      onClick: () => console.log('Add Song clicked'),
    },
    {
      id: '4',
      name: 'Send Message',
      label: 'Send Message',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" /><path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" /></svg>,
      onClick: () => console.log('Send Message clicked'),
    },
  ];

  // Sample dashboard widgets
  const dashboardWidgets = [
    {
      id: 'calendar',
      title: 'Calendar',
      type: 'calendar',
      content: <Calendar events={sampleEvents} />,
      size: 'large' as const,
    },
    {
      id: 'stats',
      title: 'Statistics',
      type: 'stats',
      content: <StatsWidget stats={sampleStats} />,
      size: 'medium' as const,
    },
    {
      id: 'upcoming',
      title: 'Upcoming Services',
      type: 'services',
      content: <UpcomingServicesWidget services={sampleServices} />,
      size: 'medium' as const,
    },
    {
      id: 'actions',
      title: 'Quick Actions',
      type: 'actions',
      content: <QuickActionsWidget actions={sampleActions} />,
      size: 'small' as const,
    },
  ];

  if (isLoggedIn && userData) {
    console.log('Rendering dashboard with user data:', userData);
    return (
      <Layout user={userData} onLogout={handleLogout} onNavigate={handleNavigate}>
        {activePage === 'dashboard' && (
          <Dashboard widgets={dashboardWidgets} />
        )}
        {activePage !== 'dashboard' && (
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">{activePage.charAt(0).toUpperCase() + activePage.slice(1)}</h2>
            <p>This page is under construction.</p>
          </div>
        )}
      </Layout>
    );
  }

  return (
    <AuthPage
      onLogin={handleLogin}
      onRegister={handleRegister}
      onForgotPassword={handleForgotPassword}
      onResetPassword={handleResetPassword}
      isLoading={isLoading}
      error={message}
      resetToken={resetToken}
    />
  );
}

export default App; 