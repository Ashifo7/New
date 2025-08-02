import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  EnvelopeIcon,
  LockClosedIcon,
  CheckCircleIcon,
  BookOpenIcon, // Used for the app icon
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

// Assuming these components are available in the project
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

/**
 * ForgotPassword component handles the process of resetting a user's password.
 * It features two steps:
 * 1. Entering the email to send an OTP.
 * 2. Entering the OTP and a new password to reset the account.
 */
export default function ForgotPassword() {
  // State to manage the current step of the password reset process
  const [step, setStep] = useState(1); // 1: email input, 2: OTP and new password input
  // State for the email input field
  const [email, setEmail] = useState('');
  // State for the OTP input field
  const [otp, setOtp] = useState('');
  // State for the new password input field
  const [newPassword, setNewPassword] = useState('');
  // State for loading indicator during API calls
  const [loading, setLoading] = useState(false);
  // State for displaying error messages
  const [error, setError] = useState('');
  // State for displaying success or informational messages
  const [message, setMessage] = useState('');
  // State to toggle new password visibility
  const [showNewPassword, setShowNewPassword] = useState(false);

  // React Router hook for navigation
  const navigate = useNavigate();

  /**
   * Effect hook to check for an existing token on component mount.
   * If a token is found, it navigates the user away, assuming they are already logged in.
   */
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/profile-complete'); // Redirect if user is already authenticated
    }
  }, [navigate]); // Dependency array ensures effect runs only when navigate changes

  /**
   * Handles the submission of the email form (Step 1).
   * Sends a request to the backend to send an OTP to the provided email address.
   * @param {Object} e - The event object from the form submission.
   */
  const handleEmailSubmit = async e => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(''); // Clear previous errors
    setLoading(true); // Show loading indicator
    setMessage(''); // Clear previous messages

    try {
      // API call to request OTP for password reset
      const res = await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      // Check if OTP request was successful
      if (!data.success) {
        throw new Error(data.error || 'Failed to send OTP. Please try again.');
      }

      setMessage('OTP sent to your email. Please check your inbox.'); // Inform user
      setStep(2); // Move to the next step (OTP and new password input)
    } catch (err) {
      setError(err.message); // Display error message
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  /**
   * Handles the submission of the reset password form (Step 2).
   * Sends the email, OTP, and new password to the backend to reset the password.
   * Redirects to the login page upon successful password reset.
   * @param {Object} e - The event object from the form submission.
   */
  const handleResetSubmit = async e => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(''); // Clear previous errors
    setLoading(true); // Show loading indicator
    setMessage(''); // Clear previous messages

    try {
      // API call to reset the password
      const res = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      const data = await res.json();

      // Check if password reset was successful
      if (!data.success) {
        throw new Error(data.error || 'Failed to reset password. Please check your OTP or try again.');
      }

      setMessage('Password reset successful! Redirecting to login...'); // Inform user
      // Redirect to login page after a short delay
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message); // Display error message
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header Section */}
          <div className="text-center animate-fade-in-up">
            <div className="flex items-center justify-center mb-6">
              {/* Application Icon */}
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-large floating">
                <BookOpenIcon className="h-8 w-8 text-white" /> {/* Using BookOpenIcon for StudyBuddy */}
              </div>
            </div>
            {/* Dynamic Header Text based on current step */}
            <h2 className="text-3xl font-display font-bold text-gray-100 text-balance">
              {step === 1 ? (
                <>
                  Forgot your
                  <span className="block gradient-text">password?</span>
                </>
              ) : (
                <>
                  Reset your
                  <span className="block gradient-text">password</span>
                </>
              )}
            </h2>
            {/* Dynamic Sub-header Text based on current step */}
            <p className="mt-3 text-gray-300 font-body">
              {step === 1
                ? 'Enter your email address to receive a verification code.'
                : `Enter the 6-digit code sent to ${email} and your new password.`
              }
            </p>
          </div>

          {/* Card containing the form */}
          <Card className="animate-fade-in-up shadow-large" hover>
            <Card.Body className="space-y-6" padding="lg">
              {/* Error Message Display */}
              {error && (
                <div className="bg-danger-50 border border-danger-200 rounded-xl p-4 animate-fade-in">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-danger-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-danger-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Message Display */}
              {message && (
                <div className="bg-success-50 border border-success-200 rounded-xl p-4 animate-fade-in">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CheckCircleIcon className="h-5 w-5 text-success-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-success-800">{message}</p>
                    </div>
                  </div>
                </div>
              )}

              {step === 1 ? (
                // Step 1: Email Input Form
                <form onSubmit={handleEmailSubmit} className="space-y-5">
                  <Input
                    name="email"
                    type="email"
                    label="Email address"
                    placeholder="john@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    icon={EnvelopeIcon}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    loading={loading}
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </Button>
                </form>
              ) : (
                // Step 2: OTP and New Password Input Form
                <form onSubmit={handleResetSubmit} className="space-y-5">
                  <Input
                    name="otp"
                    label="Verification Code"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    required
                    maxLength="6"
                    className="text-center text-lg tracking-widest font-mono"
                  />
                  <div className="relative">
                    <Input
                      name="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      label="New Password"
                      placeholder="Enter your new password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required
                      minLength="6"
                      icon={LockClosedIcon}
                      helperText="Must be at least 6 characters long"
                    />
                    {/* Button to toggle new password visibility */}
                    <button
                      type="button"
                      className="absolute right-4 top-11 text-secondary-400 hover:text-secondary-600 transition-colors duration-200"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                    >
                      {showNewPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    loading={loading}
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    fullWidth
                    onClick={() => { setStep(1); setError(''); setMessage(''); setEmail(''); setOtp(''); setNewPassword(''); }}
                    className="text-gray-400 hover:text-gray-200"
                  >
                    ← Back to Email Input
                  </Button>
                </form>
              )}

              {/* Link to Login Page */}
              <div className="text-center text-sm text-gray-400 font-body">
                Remember your password?{' '}
                <Link
                  to="/login"
                  className="text-primary-400 hover:text-primary-300 font-semibold transition-colors duration-200 hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </Card.Body>
          </Card>

          {/* Footer Text */}
          <div className="text-center text-xs text-gray-500 animate-fade-in font-body">
            <p>By proceeding, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
