import React, { useState } from 'react';

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => void;
  onBack: () => void;
  isLoading?: boolean;
  error?: string;
  success?: string;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit,
  onBack,
  isLoading = false,
  error,
  success,
}) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-primary-800">Reset Password</h1>
        <p className="text-neutral-600 mt-2">
          Enter your email and we'll send you a link to reset your password
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
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
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

        <button
          type="submit"
          disabled={isLoading || !!success}
          className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Sending...' : 'Send reset link'}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="w-full mt-3 py-2 px-4 bg-white border border-neutral-300 text-neutral-700 font-medium rounded-md hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          Back to sign in
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm; 