import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';

type AuthView = 'login' | 'register' | 'forgot-password' | 'reset-password';

interface AuthPageProps {
  onLogin: (email: string, password: string) => void;
  onRegister: (firstName: string, lastName: string, email: string, password: string, churchName: string) => void;
  onForgotPassword: (email: string) => void;
  onResetPassword: (password: string, token: string) => void;
  isLoading?: boolean;
  error?: string;
  resetToken?: string;
}

const AuthPage: React.FC<AuthPageProps> = ({
  onLogin,
  onRegister,
  onForgotPassword,
  onResetPassword,
  isLoading = false,
  error,
  resetToken,
}) => {
  const [view, setView] = useState<AuthView>(resetToken ? 'reset-password' : 'login');
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState('');
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState('');

  const handleForgotPasswordSubmit = (email: string) => {
    onForgotPassword(email);
    setForgotPasswordSuccess('Password reset link sent! Please check your email.');
  };

  const handleResetPasswordSubmit = (password: string, token: string) => {
    onResetPassword(password, token);
    setResetPasswordSuccess('Your password has been successfully reset!');
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {view === 'login' && (
          <LoginForm
            onSubmit={onLogin}
            onForgotPassword={() => setView('forgot-password')}
            onRegister={() => setView('register')}
            isLoading={isLoading}
            error={error}
          />
        )}

        {view === 'register' && (
          <RegisterForm
            onSubmit={onRegister}
            onLogin={() => setView('login')}
            isLoading={isLoading}
            error={error}
          />
        )}

        {view === 'forgot-password' && (
          <ForgotPasswordForm
            onSubmit={handleForgotPasswordSubmit}
            onBack={() => setView('login')}
            isLoading={isLoading}
            error={error}
            success={forgotPasswordSuccess}
          />
        )}

        {view === 'reset-password' && resetToken && (
          <ResetPasswordForm
            onSubmit={handleResetPasswordSubmit}
            onBack={() => setView('login')}
            token={resetToken}
            isLoading={isLoading}
            error={error}
            success={resetPasswordSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default AuthPage; 