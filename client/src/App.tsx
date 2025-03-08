import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('Test User');
  const [churchName, setChurchName] = useState('Test Church');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      console.log('Attempting login with:', { email, password });
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      console.log('Login response:', response.data);
      if (response.data.success) {
        setMessage('Login successful!');
        setIsLoggedIn(true);
        setUserData(response.data.user);
        localStorage.setItem('token', response.data.token);
      } else {
        setMessage('Login failed: ' + response.data.message);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        setMessage('Login failed: ' + (error.response.data.message || error.response.statusText));
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        setMessage('Login failed: No response from server. Please check if the server is running.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        setMessage('Login failed: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      console.log('Attempting registration with:', { name, email, password, churchName });
      const response = await axios.post('http://localhost:5000/api/auth/register', {
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
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        setMessage('Registration failed: ' + (error.response.data.message || error.response.statusText));
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        setMessage('Registration failed: No response from server. Please check if the server is running.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        setMessage('Registration failed: ' + error.message);
      }
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

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
    setMessage('');
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-primary-800">Church Planner</h1>
            <p className="text-neutral-600 mt-2">Welcome, {userData?.name}!</p>
          </div>
          
          {message && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md text-sm">
              {message}
            </div>
          )}
          
          <div className="mb-4">
            <p><strong>Email:</strong> {userData?.email}</p>
            <p><strong>Church:</strong> {userData?.churchName}</p>
            <p><strong>Role:</strong> {userData?.role}</p>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary-800">Church Planner</h1>
          <p className="text-neutral-600 mt-2">
            {isRegistering ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md text-sm">
            {message}
          </div>
        )}

        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          {isRegistering && (
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="John Doe"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="you@example.com"
              required
            />
          </div>

          {isRegistering && (
            <div className="mb-4">
              <label htmlFor="church-name" className="block text-sm font-medium text-neutral-700 mb-1">
                Church Name
              </label>
              <input
                id="church-name"
                type="text"
                value={churchName}
                onChange={(e) => setChurchName(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="First Baptist Church"
                required
              />
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {isLoading ? (isRegistering ? 'Creating account...' : 'Signing in...') : (isRegistering ? 'Create account' : 'Sign in')}
          </button>
          
          <div className="text-center">
            <button
              type="button"
              onClick={toggleForm}
              className="text-primary-600 hover:text-primary-800 font-medium"
            >
              {isRegistering ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App; 