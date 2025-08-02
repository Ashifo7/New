import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserIcon,
  MapPinIcon,
  CameraIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  GlobeAltIcon,
  BookOpenIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ClockIcon,
  EyeIcon,
  EyeSlashIcon,
  StarIcon,
  HeartIcon,
  FireIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  PaintBrushIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Particles from '../components/Particles';

// Enhanced options with better organization
const SUBJECT_OPTIONS = [
  { name: 'Mathematics', icon: '📐', color: 'from-blue-500 to-cyan-500' },
  { name: 'Physics', icon: '⚛️', color: 'from-purple-500 to-pink-500' },
  { name: 'Chemistry', icon: '🧪', color: 'from-green-500 to-teal-500' },
  { name: 'Biology', icon: '🧬', color: 'from-emerald-500 to-green-500' },
  { name: 'Computer Science', icon: '💻', color: 'from-indigo-500 to-blue-500' },
  { name: 'Engineering', icon: '⚙️', color: 'from-gray-500 to-slate-500' },
  { name: 'Medicine', icon: '🏥', color: 'from-red-500 to-pink-500' },
  { name: 'Business', icon: '💼', color: 'from-yellow-500 to-orange-500' },
  { name: 'Economics', icon: '📈', color: 'from-green-500 to-emerald-500' },
  { name: 'Psychology', icon: '🧠', color: 'from-purple-500 to-violet-500' },
  { name: 'English Literature', icon: '📚', color: 'from-amber-500 to-yellow-500' },
  { name: 'History', icon: '🏛️', color: 'from-stone-500 to-gray-500' },
  { name: 'Philosophy', icon: '🤔', color: 'from-slate-500 to-gray-500' },
  { name: 'Art & Design', icon: '🎨', color: 'from-pink-500 to-rose-500' },
  { name: 'Music', icon: '🎵', color: 'from-violet-500 to-purple-500' },
  { name: 'Languages', icon: '🌍', color: 'from-teal-500 to-cyan-500' },
  { name: 'Law', icon: '⚖️', color: 'from-gray-600 to-slate-600' },
  { name: 'Architecture', icon: '🏗️', color: 'from-stone-500 to-amber-500' },
  { name: 'Data Science', icon: '📊', color: 'from-blue-500 to-indigo-500' }
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
  { 
    value: 'morning', 
    label: 'Morning Person', 
    description: '6 AM - 12 PM',
    icon: '🌅', 
    gradient: 'from-yellow-400 to-orange-500',
    bgGradient: 'from-yellow-50 to-orange-50'
  },
  { 
    value: 'afternoon', 
    label: 'Afternoon Warrior', 
    description: '12 PM - 6 PM',
    icon: '☀️', 
    gradient: 'from-orange-400 to-red-500',
    bgGradient: 'from-orange-50 to-red-50'
  },
  { 
    value: 'evening', 
    label: 'Evening Enthusiast', 
    description: '6 PM - 10 PM',
    icon: '🌆', 
    gradient: 'from-purple-400 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-50'
  },
  { 
    value: 'night', 
    label: 'Night Owl', 
    description: '10 PM - 2 AM',
    icon: '🌙', 
    gradient: 'from-indigo-400 to-purple-500',
    bgGradient: 'from-indigo-50 to-purple-50'
  }
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

// Creative Progress Ring Component
const ProgressRing = ({ percentage, size = 120 }) => {
  const radius = (size - 10) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-gray-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{percentage}%</div>
          <div className="text-xs text-gray-300">Complete</div>
        </div>
      </div>
    </div>
  );
};

// Creative Step Indicator
const StepIndicator = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-center space-x-2 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div
          key={step}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            step <= currentStep
              ? 'bg-gradient-to-r from-primary-500 to-purple-500 scale-125'
              : 'bg-gray-600 scale-100'
          }`}
        />
      ))}
    </div>
  );
};

// Floating Action Button
const FloatingActionButton = ({ onClick, icon: Icon, label, color = 'primary' }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r ${
        color === 'primary' ? 'from-primary-500 to-purple-500' : 'from-green-500 to-emerald-500'
      } rounded-full shadow-2xl hover:shadow-glow transition-all duration-300 hover:scale-110 z-50 group`}
    >
      <Icon className="h-8 w-8 text-white mx-auto" />
      <div className="absolute right-full mr-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        {label}
      </div>
    </button>
  );
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
  const [activeSection, setActiveSection] = useState('basic');

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
          setTimeout(() => navigate('/landing'), 2000);
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
        <div className="min-h-screen bg-gray-900 relative overflow-hidden">
          <Particles className="absolute inset-0 z-0" />
          <div className="relative z-10 flex items-center justify-center min-h-96">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-gray-200 font-body">Loading your profile...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user}>
      <div className="min-h-screen bg-gray-900 relative overflow-hidden">
        {/* Particles Background */}
        <Particles 
          className="absolute inset-0 z-0" 
          particleCount={150}
          particleColors={['#3B82F6', '#8B5CF6', '#EC4899']}
          moveParticlesOnHover={true}
          alphaParticles={true}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Header */}
          <div className="text-center space-y-8 mb-12 animate-fade-in-up">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-purple-600/20 blur-3xl rounded-full"></div>
              <div className="relative flex items-center justify-center space-x-6">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-600 to-purple-600 rounded-3xl shadow-2xl floating">
                  <RocketLaunchIcon className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-primary-200 to-purple-200 bg-clip-text text-transparent">
                    Build Your Study Profile
                  </h1>
                  <p className="text-xl text-gray-300 mt-2 font-body">
                    Create an amazing profile that attracts the perfect study partners
                  </p>
                </div>
              </div>
            </div>

            {/* Creative Progress Ring */}
            <div className="flex items-center justify-center space-x-8">
              <ProgressRing percentage={completionPercentage} />
              <div className="text-left space-y-2">
                <div className="flex items-center space-x-2">
                  <StarSolidIcon className="h-5 w-5 text-yellow-400" />
                  <span className="text-lg font-semibold text-white">Profile Strength</span>
                </div>
                <div className="text-sm text-gray-300">
                  {completionPercentage < 30 && "Just getting started! 🌱"}
                  {completionPercentage >= 30 && completionPercentage < 60 && "Making good progress! 🚀"}
                  {completionPercentage >= 60 && completionPercentage < 80 && "Almost there! ⭐"}
                  {completionPercentage >= 80 && "Outstanding profile! 🎉"}
                </div>
                <StepIndicator currentStep={Math.ceil(completionPercentage / 25)} totalSteps={4} />
              </div>
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`animate-slide-down mb-8 ${
              messageType === 'success' ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30' :
                messageType === 'error' ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-400/30' :
                  'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/30'
              } border rounded-2xl p-6 backdrop-blur-xl flex items-center space-x-4`}>
              {messageType === 'success' ? (
                <CheckCircleIcon className="h-6 w-6 text-green-400 flex-shrink-0" />
              ) : messageType === 'error' ? (
                <ExclamationTriangleIcon className="h-6 w-6 text-red-400 flex-shrink-0" />
              ) : (
                <SparklesIcon className="h-6 w-6 text-blue-400 flex-shrink-0" />
              )}
              <span className="font-medium text-white text-lg">{message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Enhanced Profile Preview Card */}
            <div className="xl:col-span-1">
              <div className="sticky top-24">
                <Card className="overflow-hidden bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border-primary-500/30 shadow-2xl">
                  <div className="relative h-32 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                      <div className="relative">
                        <Avatar
                          src={user.profilePic}
                          name={user.name}
                          size="3xl"
                          className="ring-4 ring-white shadow-2xl"
                        />
                        {uploading && (
                          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                          </div>
                        )}
                        <label className="absolute bottom-2 right-2 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white p-3 rounded-full shadow-xl cursor-pointer transition-all duration-300 hover:scale-110 group">
                          <CameraIcon className="h-5 w-5" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePicInput}
                            disabled={uploading}
                            className="hidden"
                          />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Upload Photo
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <Card.Body className="pt-16 text-center space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-white font-display">
                        {user.name || 'Your Name'}
                      </h3>
                      
                      {user.location?.city && user.location?.state && (
                        <div className="flex items-center justify-center space-x-2 text-gray-300 font-body">
                          <MapPinIcon className="h-4 w-4" />
                          <span>{user.location.city}, {user.location.state}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-center space-x-4 text-sm">
                        {user.personalInfo?.age && (
                          <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
                            {user.personalInfo.age} years
                          </Badge>
                        )}
                        {user.personalInfo?.gender && (
                          <Badge variant="outline" className="bg-white/10 border-white/20 text-white capitalize">
                            {user.personalInfo.gender}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {user.bio && (
                      <div className="bg-white/5 rounded-xl p-4">
                        <p className="text-gray-300 text-sm leading-relaxed font-body">{user.bio}</p>
                      </div>
                    )}

                    {user.subjectsInterested?.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center space-x-2">
                          <BookOpenIcon className="h-4 w-4 text-primary-400" />
                          <span className="text-sm font-semibold text-gray-200 font-display">Study Interests</span>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {user.subjectsInterested.slice(0, 4).map(subject => {
                            const subjectData = SUBJECT_OPTIONS.find(s => s.name === subject);
                            return (
                              <Badge 
                                key={subject} 
                                variant="primary" 
                                size="sm"
                                className={`bg-gradient-to-r ${subjectData?.color || 'from-primary-500 to-purple-500'} text-white border-0`}
                              >
                                {subjectData?.icon} {subject}
                              </Badge>
                            );
                          })}
                          {user.subjectsInterested.length > 4 && (
                            <Badge variant="outline" size="sm" className="bg-white/10 border-white/20 text-white">
                              +{user.subjectsInterested.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {user.studyTime && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center space-x-2">
                          <ClockIcon className="h-4 w-4 text-primary-400" />
                          <span className="text-sm font-semibold text-gray-200 font-display">Study Time</span>
                        </div>
                        {(() => {
                          const timeData = STUDY_TIME_OPTIONS.find(t => t.value === user.studyTime);
                          return timeData ? (
                            <Badge className={`bg-gradient-to-r ${timeData.gradient} text-white border-0`}>
                              {timeData.icon} {timeData.label}
                            </Badge>
                          ) : null;
                        })()}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </div>
            </div>

            {/* Main Form Content */}
            <div className="xl:col-span-3 space-y-8">
              {/* Basic Information */}
              <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border-primary-500/30 shadow-2xl animate-fade-in-up">
                <Card.Header className="bg-gradient-to-r from-primary-600/20 to-purple-600/20 border-b border-primary-500/30">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl">
                      <UserIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white font-display">Basic Information</h3>
                      <p className="text-sm text-gray-300 font-body">Tell us about yourself</p>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body className="space-y-8 p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name"
                      value={user.name}
                      onChange={e => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      required
                      icon={UserIcon}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                    />

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-200 font-display">
                        Gender <span className="text-red-400 ml-1">*</span>
                      </label>
                      <select
                        value={user.personalInfo?.gender || ''}
                        onChange={e => handleInputChange('personalInfo.gender', e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                      >
                        <option value="" className="bg-gray-800">Select Gender</option>
                        <option value="male" className="bg-gray-800">Male</option>
                        <option value="female" className="bg-gray-800">Female</option>
                        <option value="confused" className="bg-gray-800">Other</option>
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
                      className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                    />

                    <Input
                      label="Date of Birth"
                      type="date"
                      value={user.personalInfo?.dateOfBirth ? user.personalInfo.dateOfBirth.substring(0, 10) : ''}
                      onChange={e => handleInputChange('personalInfo.dateOfBirth', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-200 font-display">
                      Bio <span className="text-gray-400">(Optional)</span>
                    </label>
                    <textarea
                      value={user.bio}
                      onChange={e => handleInputChange('bio', e.target.value)}
                      placeholder="Tell others about yourself, your study goals, and what you're looking for in a study partner..."
                      rows={4}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 resize-none"
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-400 text-right font-body">
                      {user.bio?.length || 0}/500 characters
                    </p>
                  </div>
                </Card.Body>
              </Card>

              {/* Academic Information */}
              <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border-primary-500/30 shadow-2xl animate-fade-in-up">
                <Card.Header className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border-b border-emerald-500/30">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
                      <AcademicCapIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white font-display">Academic Information</h3>
                      <p className="text-sm text-gray-300 font-body">Your study interests and goals</p>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body className="space-y-8 p-8">
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-200 font-display">
                      Subjects of Interest <span className="text-red-400 ml-1">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {SUBJECT_OPTIONS.map(subject => (
                        <button
                          key={subject.name}
                          type="button"
                          onClick={() => toggleArrayItem('subjectsInterested', subject.name)}
                          className={`group relative p-4 rounded-2xl border-2 text-sm font-medium transition-all duration-300 hover:scale-105 transform ${
                            user.subjectsInterested?.includes(subject.name)
                              ? `border-transparent bg-gradient-to-r ${subject.color} text-white shadow-lg`
                              : 'border-white/20 bg-white/5 text-gray-200 hover:border-white/40 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <span className="text-2xl">{subject.icon}</span>
                            <span className="text-center leading-tight">{subject.name}</span>
                          </div>
                          {user.subjectsInterested?.includes(subject.name) && (
                            <div className="absolute top-2 right-2">
                              <CheckCircleSolidIcon className="h-5 w-5 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-200 font-display">
                      Preferred Study Time
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {STUDY_TIME_OPTIONS.map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleInputChange('studyTime', option.value)}
                          className={`group relative p-6 rounded-2xl border-2 text-left transition-all duration-300 hover:scale-105 transform ${
                            user.studyTime === option.value
                              ? `border-transparent bg-gradient-to-r ${option.gradient} text-white shadow-lg`
                              : 'border-white/20 bg-white/5 text-gray-200 hover:border-white/40 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <span className="text-3xl">{option.icon}</span>
                            <div>
                              <p className="font-bold font-display text-lg">{option.label}</p>
                              <p className="text-sm opacity-90 font-body">{option.description}</p>
                            </div>
                          </div>
                          {user.studyTime === option.value && (
                            <div className="absolute top-4 right-4">
                              <CheckCircleSolidIcon className="h-6 w-6 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-200 font-display">
                      Study Goals <span className="text-gray-400">(Optional)</span>
                    </label>
                    <textarea
                      value={user.studyGoals || ''}
                      onChange={e => handleInputChange('studyGoals', e.target.value)}
                      placeholder="What are your academic goals? What do you want to achieve through collaborative studying?"
                      rows={3}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 resize-none"
                      maxLength={300}
                    />
                  </div>
                </Card.Body>
              </Card>

              {/* Location Information */}
              <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border-primary-500/30 shadow-2xl animate-fade-in-up">
                <Card.Header className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-b border-blue-500/30">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                      <MapPinIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white font-display">Location</h3>
                      <p className="text-sm text-gray-300 font-body">Where are you based?</p>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body className="space-y-8 p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-200 font-display">
                        State <span className="text-red-400 ml-1">*</span>
                      </label>
                      <input
                        list="state-list"
                        value={user.location?.state || ''}
                        onChange={e => handleInputChange('location.state', e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
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
                        City <span className="text-red-400 ml-1">*</span>
                      </label>
                      <input
                        list="city-list"
                        value={user.location?.city || ''}
                        onChange={e => handleInputChange('location.city', e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
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
                        size="md"
                        className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-400/30 text-blue-300 hover:from-blue-500/30 hover:to-cyan-500/30"
                      >
                        Get Current Location
                      </Button>

                      {user.location?.coordinates?.coordinates?.length === 2 && (
                        <div className="flex items-center space-x-2 text-sm text-green-400 font-body">
                          <CheckCircleIcon className="h-5 w-5" />
                          <span>Location coordinates saved</span>
                        </div>
                      )}
                    </div>

                    <Input
                      label="Formatted Address (Optional)"
                      value={user.location?.formattedAddress || ''}
                      onChange={e => handleInputChange('location.formattedAddress', e.target.value)}
                      placeholder="Complete address for better matching"
                      className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                    />
                  </div>
                </Card.Body>
              </Card>

              {/* Personal & Cultural Information */}
              <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border-primary-500/30 shadow-2xl animate-fade-in-up">
                <Card.Header className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-purple-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                        <UserGroupIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white font-display">Personal & Cultural</h3>
                        <p className="text-sm text-gray-300 font-body">Help others understand you better</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPrivacySettings(!showPrivacySettings)}
                      icon={showPrivacySettings ? EyeSlashIcon : EyeIcon}
                      className="text-gray-300 hover:text-white"
                    >
                      Privacy
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body className="space-y-8 p-8">
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-200 font-display">
                      Languages You Speak
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {LANGUAGE_OPTIONS.map(language => (
                        <button
                          key={language}
                          type="button"
                          onClick={() => toggleArrayItem('languages', language, true)}
                          className={`group p-3 rounded-xl border text-sm font-medium transition-all duration-300 hover:scale-105 ${
                            user.personalInfo?.languages?.includes(language)
                              ? 'border-transparent bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                              : 'border-white/20 bg-white/5 text-gray-200 hover:border-white/40 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-1">
                            <ChatBubbleLeftRightIcon className="h-4 w-4" />
                            <span className="text-center">{language}</span>
                          </div>
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
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
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
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
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
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
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
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
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
                    <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-2xl p-6 space-y-4 animate-slide-down border border-white/10 backdrop-blur-sm">
                      <h4 className="font-bold text-white flex items-center space-x-2 font-display text-lg">
                        <EyeIcon className="h-5 w-5 text-purple-400" />
                        <span>Privacy Settings</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { key: 'showAge', label: 'Show my age', icon: '🎂' },
                          { key: 'showGender', label: 'Show my gender', icon: '👤' },
                          { key: 'showReligion', label: 'Show my religion', icon: '🙏' },
                          { key: 'showEthnicity', label: 'Show my ethnicity', icon: '🌍' },
                          { key: 'showCulturalBackground', label: 'Show my cultural background', icon: '🏛️' }
                        ].map(setting => (
                          <label key={setting.key} className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                            <input
                              type="checkbox"
                              checked={user.personalInfo?.privacySettings?.[setting.key] || false}
                              onChange={() => togglePrivacySetting(setting.key)}
                              className="rounded border-white/20 text-purple-600 focus:ring-purple-500 h-5 w-5 bg-white/10"
                            />
                            <span className="text-lg">{setting.icon}</span>
                            <span className="text-sm text-gray-200 font-body">{setting.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </Card.Body>
              </Card>

              {/* Study Partner Preferences */}
              <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border-primary-500/30 shadow-2xl animate-fade-in-up">
                <Card.Header className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border-b border-orange-500/30">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                      <HeartIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white font-display">Study Partner Preferences</h3>
                      <p className="text-sm text-gray-300 font-body">Who would you like to study with?</p>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body className="space-y-6 p-8">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-200 font-display">
                      Preferred Gender for Study Partners
                    </label>
                    <select
                      value={user.preferences?.preferredGender || ''}
                      onChange={e => handleInputChange('preferences.preferredGender', e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                    >
                      <option value="" className="bg-gray-800">No preference</option>
                      <option value="male" className="bg-gray-800">Male</option>
                      <option value="female" className="bg-gray-800">Female</option>
                      <option value="confused" className="bg-gray-800">Other</option>
                    </select>
                    <p className="text-xs text-gray-400 font-body">
                      This helps us match you with study partners you're comfortable with
                    </p>
                  </div>
                </Card.Body>
              </Card>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-8 border-t border-white/10">
                <div className="text-sm text-gray-300 font-body">
                  {completionPercentage < 50 ? (
                    <div className="flex items-center space-x-2">
                      <LightBulbIcon className="h-5 w-5 text-yellow-400" />
                      <span>Complete more fields to improve your matches</span>
                    </div>
                  ) : completionPercentage < 70 ? (
                    <div className="flex items-center space-x-2">
                      <FireIcon className="h-5 w-5 text-orange-400" />
                      <span>You're almost done! A few more details will help</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <StarSolidIcon className="h-5 w-5 text-yellow-400" />
                      <span className="text-green-400 font-medium">Your profile looks amazing!</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/home')}
                    disabled={saving || uploading}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    Skip for Now
                  </Button>

                  <Button
                    onClick={handleSave}
                    loading={saving}
                    disabled={uploading}
                    size="lg"
                    icon={saving ? undefined : CheckCircleIcon}
                    className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 shadow-2xl hover:shadow-glow"
                  >
                    {saving ? 'Saving Profile...' : 'Save Profile'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <FloatingActionButton
          onClick={handleSave}
          icon={saving ? SparklesIcon : RocketLaunchIcon}
          label={saving ? 'Saving...' : 'Save Profile'}
          color={completionPercentage >= 70 ? 'success' : 'primary'}
        />
      </div>
    </Layout>
  );
}