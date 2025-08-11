// src/components/Auth/ForgotPassword.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Import the real hook

const ForgotPassword = () => {
  const { forgotPassword } = useAuth(); // Get the real function
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    
    try {
      await forgotPassword(email);
      // For security, always show a generic success message.
      // This prevents users from checking if an email is registered.
      setMessage('If an account with that email exists, a password reset link has been sent.');
    } catch (err) {
      // Display the generic message even on error for security.
      setMessage('If an account with that email exists, a password reset link has been sent.');
      console.error("Forgot password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Forgot Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email to receive a reset link
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          {message ? (
            <p className="p-4 text-center text-green-800 bg-green-100 rounded-md">
              {message}
            </p>
          ) : (
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          )}

          {error && <p className="text-sm text-center text-red-500">{error}</p>}

          {!message && (
            <div>
              <button
                type="submit"
                disabled={loading}
                className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md group bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-emerald-300"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
          )}

          <div className="text-sm text-center">
            <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
              Back to Log In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
