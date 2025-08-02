import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  BookOpenIcon, // Used for the app icon
  CheckCircleIcon
} from '@heroicons/react/24/outline';

// Assuming these components are available in the project
import ContinueWithGoogle from './ContinueWithGoogle';
import Layout from '../components/layout/Layout';
import { ensureUserKeyPair } from './keyManager'; // Assuming this utility exists
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

/**
 * Signup component for user registration and OTP verification.
 * Handles form state, API calls for registration and OTP, and navigation.
 */
export default function Signup() {
  // State for form inputs
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    gender: '',
    password: ''
  });
  // State to manage the current step of the signup process (1: registration, 2: OTP verification)
  const [step, setStep] = useState(1);
  // State for OTP input
  const [otp, setOtp] = useState('');
  // State for loading indicator during API calls
  const [loading, setLoading] = useState(false);
  // State for displaying error messages
  const [error, setError] = useState('');
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  // React Router hook for navigation
  const navigate = useNavigate();

  /**
   * Effect hook to check for existing token on component mount.
   * If a token is found, navigate to '/landing'.
   */
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/landing'); // Redirect to landing if already authenticated
    }
  }, [navigate]); // Dependency array ensures effect runs only when navigate changes

  /**
   * Handles changes in form input fields.
   * Updates the form state and clears any existing error message.
   * @param {Object} e - The event object from the input change.
   */
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(''); // Clear error when user starts typing
  };

  /**
   * Handles the submission of the registration form (Step 1).
   * Sends user data to the registration API.
   * @param {Object} e - The event object from the form submission.
   */
  const handleSubmit = async e => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(''); // Clear previous errors
    setLoading(true); // Show loading indicator

    try {
      const name = `${form.firstName} ${form.lastName}`; // Combine first and last name
      const payload = {
        name,
        email: form.email,
        password: form.password,
        // Default values for other fields as per the original code
        subjectsInterested: ['General'],
        studyTime: 'evening',
        location: {
          state: '', city: '', coordinates: { type: 'Point', coordinates: [0, 0] }, formattedAddress: ''
        },
        personalInfo: {
          age: Number(form.age),
          gender: form.gender
        }
      };

      // API call to register the user
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      // Check if registration was successful
      if (!data.success) {
        throw new Error(data.error || 'Registration failed. Please try again.');
      }

      setStep(2); // Move to OTP verification step
    } catch (err) {
      setError(err.message); // Display error message
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  /**
   * Handles the submission of the OTP verification form (Step 2).
   * Sends the entered OTP to the verification API.
   * @param {Object} e - The event object from the form submission.
   */
  const handleOtpSubmit = async e => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(''); // Clear previous errors
    setLoading(true); // Show loading indicator

    try {
      // API call to verify OTP
      const res = await fetch('/api/users/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, otp })
      });
      const data = await res.json();

      // Check if OTP verification was successful
      if (!data.success) {
        throw new Error(data.error || 'OTP verification failed. Please check the code and try again.');
      }

      localStorage.setItem('token', data.token); // Store the received token
      await ensureUserKeyPair(data.token); // Ensure user key pair is generated/managed
      navigate('/landing'); // Navigate to the landing page upon successful verification
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
                {/* Changed HeartIcon to BookOpenIcon for consistency with StudyBuddy theme */}
                <BookOpenIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            {/* Dynamic Header Text based on current step */}
            <h2 className="text-3xl font-display font-bold text-gray-100 text-balance">
              {step === 1 ? (
                <>
                  Join the
                  <span className="block gradient-text">StudyBuddy</span>
                  community
                </>
              ) : (
                <>
                  Verify your
                  <span className="block gradient-text">email address</span>
                </>
              )}
            </h2>
            {/* Dynamic Sub-header Text based on current step */}
            <p className="mt-3 text-gray-300 font-body">
              {step === 1
                ? 'Create your account and find your perfect study partner'
                : `We've sent a 6-digit code to ${form.email}`
              }
            </p>
          </div>

          {/* Card containing the form */}
          <Card className="animate-fade-in-up shadow-large" hover>
            <Card.Body className="space-y-6" padding="lg">
              {step === 1 ? (
                // Registration Form (Step 1)
                <>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        name="firstName"
                        label="First Name"
                        placeholder="John"
                        value={form.firstName}
                        onChange={handleChange}
                        required
                        icon={UserIcon}
                      />
                      <Input
                        name="lastName"
                        label="Last Name"
                        placeholder="Doe"
                        value={form.lastName}
                        onChange={handleChange}
                        required
                        icon={UserIcon}
                      />
                    </div>

                    <Input
                      name="email"
                      type="email"
                      label="Email address"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      icon={EnvelopeIcon}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        name="age"
                        type="number"
                        label="Age"
                        placeholder="20"
                        value={form.age}
                        onChange={handleChange}
                        required
                        min="13"
                        max="100"
                      />
                      <div className="space-y-2">
                        <label htmlFor="gender" className="block text-sm font-semibold text-gray-200 font-display">
                          Gender <span className="text-danger-500 ml-1">*</span>
                        </label>
                        <select
                          id="gender" // Added id for accessibility
                          name="gender"
                          value={form.gender}
                          onChange={handleChange}
                          required
                          className="block w-full px-4 py-3 text-sm bg-gray-800 border border-gray-600 rounded-xl shadow-soft focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 ease-out hover:border-gray-500 text-gray-100 font-body"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option> {/* Changed 'confused' to 'other' for clarity */}
                        </select>
                      </div>
                    </div>

                    <div className="relative">
                      <Input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        placeholder="Create a strong password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        minLength="6"
                        icon={LockClosedIcon}
                        helperText="Must be at least 6 characters long"
                      />
                      {/* Button to toggle password visibility */}
                      <button
                        type="button"
                        className="absolute right-4 top-11 text-secondary-400 hover:text-secondary-600 transition-colors duration-200"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'} // Added aria-label for accessibility
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    {/* Error Message Display */}
                    {error && (
                      <div className="bg-danger-50 border border-danger-200 rounded-xl p-4 animate-fade-in">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {/* Error Icon */}
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

                    {/* Submit Button for Registration */}
                    <Button
                      type="submit"
                      fullWidth
                      size="lg"
                      loading={loading}
                      className="mt-6"
                    >
                      {loading ? 'Creating account...' : 'Create account'}
                    </Button>
                  </form>

                  {/* Separator for "Or continue with" */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-gray-900 text-gray-400 font-medium font-body">Or continue with</span>
                    </div>
                  </div>

                  {/* Google Sign-in Component */}
                  <ContinueWithGoogle />
                </>
              ) : (
                // OTP Verification Form (Step 2)
                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  <div className="text-center">
                    {/* Success Icon for OTP */}
                    <div className="flex items-center justify-center w-16 h-16 bg-success-100 rounded-full mx-auto mb-4">
                      <CheckCircleIcon className="h-8 w-8 text-success-600" />
                    </div>
                    <p className="text-sm text-gray-300 mb-6 font-body">
                      Enter the verification code we sent to your email
                    </p>
                  </div>

                  <Input
                    name="otp"
                    label="Verification Code"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    required
                    maxLength="6"
                    className="text-center text-lg tracking-widest font-mono" // Styling for OTP input
                  />

                  {/* Error Message Display for OTP */}
                  {error && (
                    <div className="bg-danger-50 border border-danger-200 rounded-xl p-4 animate-fade-in">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {/* Error Icon */}
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

                  {/* Submit Button for OTP Verification */}
                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    loading={loading}
                  >
                    {loading ? 'Verifying...' : 'Verify Email'}
                  </Button>

                  {/* Button to go back to registration */}
                  <Button
                    type="button"
                    variant="ghost"
                    fullWidth
                    onClick={() => setStep(1)}
                    className="text-gray-400 hover:text-gray-200"
                  >
                    ← Back to registration
                  </Button>
                </form>
              )}

              {/* Link to Login Page */}
              <div className="text-center text-sm text-gray-400 font-body">
                Already have an account?{' '}
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
            <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
