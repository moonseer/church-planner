import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ServicePage from './pages/ServicePage';
import EventTypesPage from './pages/EventTypesPage';
import AuthPage from './pages/AuthPage';
import { useAuth } from './hooks/useAuth';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const { 
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
  } = useAuth();

  const handleNavigate = (page: string) => {
    setActivePage(page);
  };

  if (isLoggedIn && userData) {
    return (
      <Layout user={userData} onLogout={handleLogout} onNavigate={handleNavigate}>
        {activePage === 'dashboard' && (
          <Dashboard />
        )}
        {activePage === 'services' && (
          <ServicePage />
        )}
        {activePage === 'event-types' && (
          <EventTypesPage />
        )}
        {activePage !== 'dashboard' && activePage !== 'services' && activePage !== 'event-types' && (
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