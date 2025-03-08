import React, { useState } from 'react';

interface ResetPasswordFormProps {
  onSubmit: (password: string, token: string) => void;
  onBack: () => void;
  token: string;
  isLoading?: boolean;
  error?: string;
  success?: string;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onSubmit,
  onBack,
  token,
  isLoading = false,
  error,
  success,
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    
    setPasswordError('');
    onSubmit(password, token);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-primary-800">Set New Password</h1>
        <p className="text-neutral-600 mt-2">
          Enter your new password below
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md text-sm">
          {success}
          <div className="mt-2">
            <button
              type="button"
              onClick={onBack}
              className="text-green-800 font-medium underline"
            >
              Return to login
            </button>
          </div>
        </div>
      )}

      {!success && (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="••••••••"
              required
              minLength={8}
            />
            <p className="mt-1 text-xs text-neutral-500">
              Password must be at least 8 characters long
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-neutral-700 mb-1">
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                passwordError ? 'border-red-500' : 'border-neutral-300'
              }`}
              placeholder="••••••••"
              required
            />
            {passwordError && (
              <p className="mt-1 text-xs text-red-600">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </button>

          <button
            type="button"
            onClick={onBack}
            className="w-full mt-3 py-2 px-4 bg-white border border-neutral-300 text-neutral-700 font-medium rounded-md hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            Back to sign in
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPasswordForm; 