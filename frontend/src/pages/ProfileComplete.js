import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserIcon,
  MapPinIcon,
  CameraIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  GlobeAltIcon,
  HeartIcon,
  SparklesIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ClockIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';

// Enhanced options with better organization
const SUBJECT_OPTIONS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
  'Engineering', 'Medicine', 'Business', 'Economics', 'Psychology',
  'English Literature', 'History', 'Philosophy', 'Art & Design',
  'Music', 'Languages', 'Law', 'Architecture', 'Data Science'
];

const LANGUAGE_OPTIONS = [
  'English', 'Hindi', 'Spanish', 'French', 'German', 'Mandarin',
  'Arabic', 'Bengali', 'Portuguese', 'Russian', 'Japanese',
  'Korean', 'Italian', 'Dutch', 'Swedish', 'Tamil', 'Telugu'
];

const NATIONALITY_OPTIONS = [
  'Indian', 'American', 'British', 'Canadian', 'Australian', 'Chinese',
  'French', 'German', 'Japanese', 'Brazilian', 'Mexican', 'Italian',
  'Spanish', 'Russian', 'South Korean', 'Dutch', 'Swedish'
];

const RELIGION_OPTIONS = [
  'Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain',
  'Jewish', 'Atheist', 'Agnostic', 'Other', 'Prefer not to say'
];

const ETHNICITY_OPTIONS = [
  'Asian', 'African', 'Caucasian', 'Hispanic', 'Middle Eastern',
  'Native American', 'Pacific Islander', 'Mixed', 'Other', 'Prefer not to say'
];

const CULTURE_OPTIONS = [
  'Western', 'Eastern', 'Latin American', 'African', 'Middle Eastern',
  'South Asian', 'East Asian', 'European', 'Nordic', 'Mediterranean', 'Other'
];

const STATE_CITY = {
  'Karnataka': ['Bangalore', 'Mysore', 'Mangalore', 'Hubli', 'Belgaum'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
  'Delhi': ['New Delhi', 'Dwarka', 'Rohini', 'Gurgaon', 'Noida'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri', 'Asansol'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Noida', 'Agra', 'Varanasi'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
  'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'],
  'Haryana': ['Gurgaon', 'Faridabad', 'Panipat', 'Ambala', 'Karnal'],
  'Other': ['Other']
};

const STATE_OPTIONS = Object.keys(STATE_CITY);

const STUDY_TIME_OPTIONS = [
  { value: 'morning', label: 'Morning (6 AM - 12 PM)', icon: '🌅' },
  { value: 'afternoon', label: 'Afternoon (12 PM - 6 PM)', icon: '☀️' },
  { value: 'evening', label: 'Evening (6 PM - 10 PM)', icon: '🌆' },
  { value: 'night', label: 'Night (10 PM - 2 AM)', icon: '🌙' }
];

const initialState = {
  name: '',
  bio: '',
  studyGoals: '',
  subjectsInterested: [],
  studyTime: '',
  location: {
    state: '',
    city: '',
    coordinates: { coordinates: ['', ''] },
    formattedAddress: ''
  },
  personalInfo: {
    gender: '',
    age: '',
    dateOfBirth: '',
    nationality: '',
    languages: [],
    religion: '',
    ethnicity: '',
    culturalBackground: '',
    privacySettings: {
      showAge: true,
      showGender: true,
      showReligion: false,
      showEthnicity: false,
      showCulturalBackground: false
    }
  },
  preferences: {
    preferredGender: '',
  },
  profilePic: ''
};

export default function ProfileComplete() {
  const navigate = useNavigate();
  const [user, setUser] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [cityOptions, setCityOptions] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadTimer, setUploadTimer] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);

  // Calculate profile completion percentage
  useEffect(() => {
    const calculateCompletion = () => {
      let completed = 0;
      const total = 12;

      if (user.name) completed++;
      if (user.bio) completed++;
      if (user.subjectsInterested?.length > 0) completed++;
      if (user.studyTime) completed++;
      if (user.location?.state) completed++;
      if (user.location?.city) completed++;
      if (user.personalInfo?.age) completed++;
      if (user.personalInfo?.gender) completed++;
      if (user.personalInfo?.languages?.length > 0) completed++;
      if (user.personalInfo?.nationality) completed++;
      if (user.profilePic) completed++;
      if (user.studyGoals) completed++;

      return Math.round((completed / total) * 100);
    };

    setCompletionPercentage(calculateCompletion());
  }, [user]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('/api/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser({ ...initialState, ...data.user });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [navigate]);

  // Update city options when state changes
  useEffect(() => {
    const state = user.location?.state;
    if (state && STATE_CITY[state]) {
      setCityOptions(STATE_CITY[state]);
    } else {
      setCityOptions([]);
    }
  }, [user.location?.state]);

  // Auto-upload profile picture
  useEffect(() => {
    if (!profilePicFile) return;

    let didCancel = false;
    setUploading(true);
    showMessage('Uploading profile picture...', 'info');

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('profilePic', profilePicFile);
    const controller = new AbortController();

    const timer = setTimeout(() => {
      controller.abort();
      setUploading(false);
      showMessage('Upload timed out. Please try again.', 'error');
    }, 20000);

    setUploadTimer(timer);

    fetch('/api/users/me/profile-pic/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
      signal: controller.signal
    })
      .then(res => res.json())
      .then(data => {
        if (didCancel) return;
        clearTimeout(timer);
        setUploadTimer(null);

        if (data.success) {
          setUser(u => ({ ...u, profilePic: data.url }));
          showMessage('Profile picture updated successfully!', 'success');
        } else {
          showMessage(data.error || 'Error uploading picture', 'error');
        }
        setUploading(false);
        setProfilePicFile(null);
      })
      .catch(err => {
        if (didCancel) return;
        clearTimeout(timer);
        setUploadTimer(null);

        if (err.name === 'AbortError') {
          showMessage('Upload timed out. Please try again.', 'error');
        } else {
          showMessage('Error uploading picture', 'error');
        }
        setUploading(false);
        setProfilePicFile(null);
      });

    return () => {
      didCancel = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [profilePicFile]);

  const showMessage = (msg, type = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const toggleArrayItem = (field, value, isNested = false) => {
    setUser(u => {
      if (isNested) {
        const arr = Array.isArray(u.personalInfo[field]) ? u.personalInfo[field] : [];
        return {
          ...u,
          personalInfo: {
            ...u.personalInfo,
            [field]: arr.includes(value)
              ? arr.filter(v => v !== value)
              : [...arr, value]
          }
        };
      } else {
        const arr = Array.isArray(u[field]) ? u[field] : [];
        return {
          ...u,
          [field]: arr.includes(value)
            ? arr.filter(v => v !== value)
            : [...arr, value]
        };
      }
    });
  };

  const handleInputChange = (field, value) => {
    if (field.startsWith('personalInfo.')) {
      const fieldName = field.split('.')[1];
      setUser(u => ({
        ...u,
        personalInfo: { ...u.personalInfo, [fieldName]: value }
      }));
    } else if (field.startsWith('location.')) {
      const fieldName = field.split('.')[1];
      setUser(u => ({
        ...u,
        location: { ...u.location, [fieldName]: value }
      }));
    } else if (field.startsWith('preferences.')) {
      const fieldName = field.split('.')[1];
      setUser(u => ({
        ...u,
        preferences: { ...u.preferences, [fieldName]: value }
      }));
    } else {
      setUser(u => ({ ...u, [field]: value }));
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      showMessage('Geolocation is not supported by this browser', 'error');
      return;
    }

    showMessage('Getting your location...', 'info');

    navigator.geolocation.getCurrentPosition(
      pos => {
        setUser(u => ({
          ...u,
          location: {
            ...u.location,
            coordinates: {
              type: 'Point',
              coordinates: [pos.coords.longitude, pos.coords.latitude]
            }
          }
        }));
        showMessage('Location updated successfully!', 'success');
      },
      err => {
        showMessage('Could not get your location. Please check permissions.', 'error');
      }
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    const token = localStorage.getItem('token');
    const toSend = {
      ...user,
      personalInfo: {
        ...user.personalInfo,
        privacySettings: user.personalInfo.privacySettings
      }
    };

    try {
      const res = await fetch('/api/users/me/any', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(toSend)
      });

      const data = await res.json();

      if (data.success) {
        showMessage('Profile saved successfully!', 'success');
        // Auto-navigate to home if profile is substantially complete
        if (completionPercentage >= 70) {
          setTimeout(() => navigate('/home'), 2000);
        }
      } else {
        showMessage(data.error || 'Error saving profile', 'error');
      }
    } catch (error) {
      showMessage('Network error. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleProfilePicInput = e => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showMessage('File size must be less than 5MB', 'error');
        return;
      }
      if (!file.type.startsWith('image/')) {
        showMessage('Please select an image file', 'error');
        return;
      }
      setProfilePicFile(file);
    }
  };

  const togglePrivacySetting = (setting) => {
    setUser(u => ({
      ...u,
      personalInfo: {
        ...u.personalInfo,
        privacySettings: {
          ...u.personalInfo.privacySettings,
          [setting]: !u.personalInfo.privacySettings[setting]
        }
      }
    }));
  };

  if (loading) {
    return (
      <Layout user={user}>
        <div className="flex items-center justify-center min-h-96 bg-gray-900">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-200 font-body">Loading your profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header with Progress */}
        <div className="text-center space-y-6 animate-fade-in-up">
          <div className="flex items-center justify-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-large">
              <UserIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Complete Your Profile</h1>
              <p className="text-gray-200 mt-1 font-body">Help others find the perfect study partner</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm text-gray-200 mb-2 font-body">
              <span>Profile Completion</span>
              <span className="font-semibold">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-secondary-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-success-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            {completionPercentage >= 70 && (
              <p className="text-sm text-success-400 mt-2 flex items-center justify-center space-x-1 font-body">
                <CheckCircleSolidIcon className="h-4 w-4" />
                <span>Great! Your profile looks complete</span>
              </p>
            )}
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`animate-slide-down ${
            messageType === 'success' ? 'bg-success-50 border-success-200 text-success-800' :
              messageType === 'error' ? 'bg-danger-50 border-danger-200 text-danger-800' :
                'bg-primary-50 border-primary-200 text-primary-800'
            } border rounded-xl p-4 flex items-center space-x-3`}>
            {messageType === 'success' ? (
              <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />
            ) : messageType === 'error' ? (
              <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0" />
            ) : (
              <SparklesIcon className="h-5 w-5 flex-shrink-0" />
            )}
            <span className="font-medium">{message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 animate-fade-in">
              <Card.Body className="text-center space-y-6">
                <div className="relative inline-block">
                  <Avatar
                    src={user.profilePic}
                    name={user.name}
                    size="3xl"
                    className="mx-auto ring-4 ring-white shadow-large"
                  />
                  {uploading && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full shadow-large cursor-pointer transition-all duration-300 hover:scale-110">
                    <CameraIcon className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePicInput}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-white font-display">
                    {user.name || 'Your Name'}
                  </h3>
                  {user.location?.city && user.location?.state && (
                    <div className="flex items-center justify-center space-x-1 text-gray-300 font-body">
                      <MapPinIcon className="h-4 w-4" />
                      <span>{user.location.city}, {user.location.state}</span>
                    </div>
                  )}
                  {user.personalInfo?.age && (
                    <p className="text-gray-300 font-body">{user.personalInfo.age} years old</p>
                  )}
                </div>

                {user.subjectsInterested?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-200 font-display">Study Interests</p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {user.subjectsInterested.slice(0, 3).map(subject => (
                        <Badge key={subject} variant="primary" size="xs">
                          {subject}
                        </Badge>
                      ))}
                      {user.subjectsInterested.length > 3 && (
                        <Badge variant="outline" size="xs">
                          +{user.subjectsInterested.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <Card className="animate-fade-in-up">
              <Card.Header gradient>
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-5 w-5 text-gray-200" />
                  <h3 className="text-lg font-semibold text-gray-100 font-display">Basic Information</h3>
                </div>
              </Card.Header>
              <Card.Body className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    value={user.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    required
                    icon={UserIcon}
                  />

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-200 font-display">
                      Gender <span className="text-danger-500 ml-1">*</span>
                    </label>
                    <select
                      value={user.personalInfo?.gender || ''}
                      onChange={e => handleInputChange('personalInfo.gender', e.target.value)}
                      className="input"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="confused">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Age"
                    type="number"
                    value={user.personalInfo?.age || ''}
                    onChange={e => handleInputChange('personalInfo.age', e.target.value)}
                    placeholder="Your age"
                    min="13"
                    max="100"
                  />

                  <Input
                    label="Date of Birth"
                    type="date"
                    value={user.personalInfo?.dateOfBirth ? user.personalInfo.dateOfBirth.substring(0, 10) : ''}
                    onChange={e => handleInputChange('personalInfo.dateOfBirth', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-200 font-display">
                    Bio <span className="text-secondary-500">(Optional)</span>
                  </label>
                  <textarea
                    value={user.bio}
                    onChange={e => handleInputChange('bio', e.target.value)}
                    placeholder="Tell others about yourself, your study goals, and what you're looking for in a study partner..."
                    rows={4}
                    className="input resize-none"
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-400 text-right font-body">
                    {user.bio?.length || 0}/500 characters
                  </p>
                </div>
              </Card.Body>
            </Card>

            {/* Academic Information */}
            <Card className="animate-fade-in-up">
              <Card.Header gradient>
                <div className="flex items-center space-x-2">
                  <AcademicCapIcon className="h-5 w-5 text-gray-200" />
                  <h3 className="text-lg font-semibold text-gray-100 font-display">Academic Information</h3>
                </div>
              </Card.Header>
              <Card.Body className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-200 font-display">
                    Subjects of Interest <span className="text-danger-500 ml-1">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {SUBJECT_OPTIONS.map(subject => (
                      <button
                        key={subject}
                        type="button"
                        onClick={() => toggleArrayItem('subjectsInterested', subject)}
                        className={`p-3 rounded-xl border-2 text-sm font-medium transition-all duration-300 hover:scale-105 ${
                          user.subjectsInterested?.includes(subject)
                            ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-medium'
                            : 'border-gray-600 bg-gray-800 text-gray-200 hover:border-gray-500 hover:bg-gray-700'
                        }`}
                      >
                        <BookOpenIcon className="h-4 w-4 mx-auto mb-1" />
                        {subject}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-200 font-display">
                    Preferred Study Time
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {STUDY_TIME_OPTIONS.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleInputChange('studyTime', option.value)}
                        className={`p-4 rounded-xl border-2 text-left transition-all duration-300 hover:scale-105 ${
                          user.studyTime === option.value
                            ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-medium'
                            : 'border-gray-600 bg-gray-800 text-gray-200 hover:border-gray-500 hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{option.icon}</span>
                          <div>
                            <p className="font-medium font-display">{option.label.split(' (')[0]}</p>
                            <p className="text-sm opacity-75 font-body">({option.label.split(' (')[1]}</p>
                            )
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-200 font-display">
                    Study Goals <span className="text-secondary-500">(Optional)</span>
                  </label>
                  <textarea
                    value={user.studyGoals || ''}
                    onChange={e => handleInputChange('studyGoals', e.target.value)}
                    placeholder="What are your academic goals? What do you want to achieve through collaborative studying?"
                    rows={3}
                    className="input resize-none"
                    maxLength={300}
                  />
                </div>
              </Card.Body>
            </Card>

            {/* Location Information */}
            <Card className="animate-fade-in-up">
              <Card.Header gradient>
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="h-5 w-5 text-gray-200" />
                  <h3 className="text-lg font-semibold text-gray-100 font-display">Location</h3>
                </div>
              </Card.Header>
              <Card.Body className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-200 font-display">
                      State <span className="text-danger-500 ml-1">*</span>
                    </label>
                    <input
                      list="state-list"
                      value={user.location?.state || ''}
                      onChange={e => handleInputChange('location.state', e.target.value)}
                      className="input"
                      placeholder="Select or type your state"
                      autoComplete="off"
                    />
                    <datalist id="state-list">
                      {STATE_OPTIONS.map(state => (
                        <option key={state} value={state} />
                      ))}
                    </datalist>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-200 font-display">
                      City <span className="text-danger-500 ml-1">*</span>
                    </label>
                    <input
                      list="city-list"
                      value={user.location?.city || ''}
                      onChange={e => handleInputChange('location.city', e.target.value)}
                      className="input"
                      placeholder="Select or type your city"
                      autoComplete="off"
                    />
                    <datalist id="city-list">
                      {cityOptions.map(city => (
                        <option key={city} value={city} />
                      ))}
                    </datalist>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleGetLocation}
                      icon={GlobeAltIcon}
                      size="sm"
                    >
                      Get Current Location
                    </Button>

                    {user.location?.coordinates?.coordinates?.length === 2 && (
                      <div className="flex items-center space-x-2 text-sm text-success-400 font-body">
                        <CheckCircleIcon className="h-4 w-4" />
                        <span>Location coordinates saved</span>
                      </div>
                    )}
                  </div>

                  <Input
                    label="Formatted Address (Optional)"
                    value={user.location?.formattedAddress || ''}
                    onChange={e => handleInputChange('location.formattedAddress', e.target.value)}
                    placeholder="Complete address for better matching"
                  />
                </div>
              </Card.Body>
            </Card>

            {/* Personal & Cultural Information */}
            <Card className="animate-fade-in-up">
              <Card.Header gradient>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <UserGroupIcon className="h-5 w-5 text-gray-200" />
                    <h3 className="text-lg font-semibold text-gray-100 font-display">Personal & Cultural</h3>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPrivacySettings(!showPrivacySettings)}
                    icon={showPrivacySettings ? EyeSlashIcon : EyeIcon}
                  >
                    Privacy
                  </Button>
                </div>
              </Card.Header>
              <Card.Body className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-200 font-display">
                    Languages You Speak
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {LANGUAGE_OPTIONS.map(language => (
                      <button
                        key={language}
                        type="button"
                        onClick={() => toggleArrayItem('languages', language, true)}
                        className={`p-2 rounded-lg border text-sm font-medium transition-all duration-300 hover:scale-105 ${
                          user.personalInfo?.languages?.includes(language)
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-600 bg-gray-800 text-gray-200 hover:border-gray-500'
                        }`}
                      >
                        <ChatBubbleLeftRightIcon className="h-3 w-3 mx-auto mb-1" />
                        {language}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-200 font-display">
                      Nationality
                    </label>
                    <input
                      list="nationality-list"
                      value={user.personalInfo?.nationality || ''}
                      onChange={e => handleInputChange('personalInfo.nationality', e.target.value)}
                      className="input"
                      placeholder="Your nationality"
                      autoComplete="off"
                    />
                    <datalist id="nationality-list">
                      {NATIONALITY_OPTIONS.map(option => (
                        <option key={option} value={option} />
                      ))}
                    </datalist>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-200 font-display">
                      Religion
                    </label>
                    <input
                      list="religion-list"
                      value={user.personalInfo?.religion || ''}
                      onChange={e => handleInputChange('personalInfo.religion', e.target.value)}
                      className="input"
                      placeholder="Your religion (optional)"
                      autoComplete="off"
                    />
                    <datalist id="religion-list">
                      {RELIGION_OPTIONS.map(option => (
                        <option key={option} value={option} />
                      ))}
                    </datalist>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-200 font-display">
                      Ethnicity
                    </label>
                    <input
                      list="ethnicity-list"
                      value={user.personalInfo?.ethnicity || ''}
                      onChange={e => handleInputChange('personalInfo.ethnicity', e.target.value)}
                      className="input"
                      placeholder="Your ethnicity (optional)"
                      autoComplete="off"
                    />
                    <datalist id="ethnicity-list">
                      {ETHNICITY_OPTIONS.map(option => (
                        <option key={option} value={option} />
                      ))}
                    </datalist>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-200 font-display">
                      Cultural Background
                    </label>
                    <input
                      list="culture-list"
                      value={user.personalInfo?.culturalBackground || ''}
                      onChange={e => handleInputChange('personalInfo.culturalBackground', e.target.value)}
                      className="input"
                      placeholder="Your cultural background"
                      autoComplete="off"
                    />
                    <datalist id="culture-list">
                      {CULTURE_OPTIONS.map(option => (
                        <option key={option} value={option} />
                      ))}
                    </datalist>
                  </div>
                </div>

                {/* Privacy Settings */}
                {showPrivacySettings && (
                  <div className="bg-gray-800/50 rounded-xl p-4 space-y-4 animate-slide-down border border-gray-600">
                    <h4 className="font-semibold text-gray-100 flex items-center space-x-2 font-display">
                      <EyeIcon className="h-4 w-4" />
                      <span>Privacy Settings</span>
                    </h4>
                    <div className="space-y-3">
                      {[
                        { key: 'showAge', label: 'Show my age' },
                        { key: 'showGender', label: 'Show my gender' },
                        { key: 'showReligion', label: 'Show my religion' },
                        { key: 'showEthnicity', label: 'Show my ethnicity' },
                        { key: 'showCulturalBackground', label: 'Show my cultural background' }
                      ].map(setting => (
                        <label key={setting.key} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={user.personalInfo?.privacySettings?.[setting.key] || false}
                            onChange={() => togglePrivacySetting(setting.key)}
                            className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
                          />
                          <span className="text-sm text-gray-200 font-body">{setting.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Preferences */}
            <Card className="animate-fade-in-up">
              <Card.Header gradient>
                <div className="flex items-center space-x-2">
                  <HeartIcon className="h-5 w-5 text-gray-200" />
                  <h3 className="text-lg font-semibold text-gray-100 font-display">Study Partner Preferences</h3>
                </div>
              </Card.Header>
              <Card.Body className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-200 font-display">
                    Preferred Gender for Study Partners
                  </label>
                  <select
                    value={user.preferences?.preferredGender || ''}
                    onChange={e => handleInputChange('preferences.preferredGender', e.target.value)}
                    className="input"
                  >
                    <option value="">No preference</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="confused">Other</option>
                  </select>
                  <p className="text-xs text-gray-400 font-body">
                    This helps us match you with study partners you're comfortable with
                  </p>
                </div>
              </Card.Body>
            </Card>

            {/* Save Button */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-600">
              <div className="text-sm text-gray-300 font-body">
                {completionPercentage < 50 ? (
                  <span>Complete more fields to improve your matches</span>
                ) : completionPercentage < 70 ? (
                  <span>You're almost done! A few more details will help</span>
                ) : (
                  <span className="text-success-400 font-medium">Your profile looks great!</span>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant="secondary"
                  onClick={() => navigate('/home')}
                  disabled={saving || uploading}
                >
                  Skip for Now
                </Button>

                <Button
                  onClick={handleSave}
                  loading={saving}
                  disabled={uploading}
                  size="lg"
                  icon={saving ? undefined : CheckCircleIcon}
                  className="shadow-large"
                >
                  {saving ? 'Saving Profile...' : 'Save Profile'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}