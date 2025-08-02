import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpenIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
  FunnelIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  CalendarIcon,
  StarIcon,
  FireIcon,
  BoltIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import {
  BookOpenIcon as BookOpenSolidIcon,
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon,
} from '@heroicons/react/24/solid';

// Assuming these components are available in the project
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';

/**
 * Utility function to extract unique options for filter dropdowns/datalists.
 * It traverses an array of objects and extracts values from a specified field path,
 * handling both direct values and arrays of values.
 * @param {Array<Object>} users - The array of user objects to process.
 * @param {string} fieldPath - The dot-separated string path to the field (e.g., 'personalInfo.gender').
 * @returns {Array<string>} An array of unique, non-empty string options.
 */
function getUniqueOptions(users, fieldPath) {
  const values = new Set();
  users.forEach((u) => {
    let val = u;
    for (const key of fieldPath.split('.')) {
      if (val && typeof val === 'object') {
        val = val[key];
      } else {
        val = undefined;
        break;
      }
    }
    if (Array.isArray(val)) {
      val.forEach((v) => values.add(v));
    } else if (val) {
      values.add(val);
    }
  });
  return Array.from(values).filter(Boolean);
}

/**
 * Enhanced Profile Card Component with a flip effect and modern design.
 * This card shows a user's profile picture and basic info on the front,
 * and more detailed information like bio, goals, and languages on the back.
 */
const ProfileCard = ({ user, onLike, onPass, loading, index, totalUsers }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="relative w-full max-w-sm mx-auto perspective-1000">
      {/* Card Stack Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-3xl transform rotate-1 scale-95 opacity-60"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-primary-500/20 rounded-3xl transform -rotate-1 scale-97 opacity-40"></div>

      {/* Main Card Container with Flip Animation */}
      <Card className={`relative bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 border-2 border-primary-500/30 shadow-2xl hover:shadow-glow transition-all duration-700 transform hover:-translate-y-2 hover:scale-105 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        <div className="absolute top-4 right-4 z-10 backface-hidden">
          <div className="flex items-center space-x-2">
            <Badge variant="primary" size="xs" className="animate-pulse">
              #{index + 1} of {totalUsers}
            </Badge>
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="p-2 bg-gray-700/80 backdrop-blur-sm rounded-full hover:bg-gray-600/80 transition-all duration-300"
              aria-label="Flip card for more info"
            >
              <SparklesIcon className="h-4 w-4 text-primary-400" />
            </button>
          </div>
        </div>

        <Card.Body className="p-0 relative overflow-hidden backface-hidden" padding="none">
          {!isFlipped ? (
            // Front of card
            <div className="space-y-6">
              {/* Hero Section with Profile Image */}
              <div className="relative h-80 bg-gradient-to-br from-primary-600/20 via-purple-600/20 to-pink-600/20 overflow-hidden rounded-t-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10"></div>

                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt={user.name}
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      imageLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-purple-600">
                    <div className="text-6xl font-bold text-white opacity-80">
                      {user.name?.charAt(0)?.toUpperCase()}
                    </div>
                  </div>
                )}

                {/* Floating Stats */}
                <div className="absolute top-4 left-4 z-20">
                  <div className="flex flex-col space-y-2">
                    {user.stats?.rating > 0 && (
                      <div className="flex items-center space-x-1 bg-yellow-500/90 backdrop-blur-sm px-2 py-1 rounded-full">
                        <StarSolidIcon className="h-3 w-3 text-white" />
                        <span className="text-xs font-bold text-white">
                          {user.stats.rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                    {user.stats?.studySessionsCount > 0 && (
                      <div className="flex items-center space-x-1 bg-green-500/90 backdrop-blur-sm px-2 py-1 rounded-full">
                        <FireIcon className="h-3 w-3 text-white" />
                        <span className="text-xs font-bold text-white">
                          {user.stats.studySessionsCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Name and Basic Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <div className="space-y-3">
                    <div className="flex items-end justify-between">
                      <div>
                        <h2 className="text-3xl font-bold text-white font-display mb-1">{user.name}</h2>
                        <div className="flex items-center space-x-3 text-sm text-gray-200">
                          {user.personalInfo?.age && (
                            <span className="font-medium">{user.personalInfo.age} years</span>
                          )}
                          {user.personalInfo?.gender && (
                            <Badge variant="outline" size="xs" className="text-white border-white/30">
                              {user.personalInfo.gender}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {user.isOnline && (
                        <div className="flex items-center space-x-1 bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          <span className="text-xs font-medium text-white">Online</span>
                        </div>
                      )}
                    </div>

                    {(user.location?.city || user.location?.state) && (
                      <div className="flex items-center space-x-1 text-gray-200">
                        <MapPinIcon className="h-4 w-4" />
                        <span className="text-sm">
                          {user.location.city}
                          {user.location.city && user.location.state && ', '}
                          {user.location.state}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Info Section */}
              <div className="px-6 pb-6 space-y-4">
                {/* Study Time */}
                {user.studyTime && (
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="h-5 w-5 text-blue-400" />
                      <span className="text-sm font-medium text-gray-200">Preferred Time</span>
                    </div>
                    <Badge variant="primary" className="capitalize font-semibold">
                      {user.studyTime}
                    </Badge>
                  </div>
                )}

                {/* Subjects Preview */}
                {Array.isArray(user.subjectsInterested) && user.subjectsInterested.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <AcademicCapIcon className="h-5 w-5 text-primary-400" />
                      <span className="text-sm font-semibold text-gray-200">Study Interests</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {user.subjectsInterested.slice(0, 3).map((subject) => (
                        <Badge key={subject} variant="primary" size="sm" className="font-medium">
                          {subject}
                        </Badge>
                      ))}
                      {user.subjectsInterested.length > 3 && (
                        <Badge variant="outline" size="sm" className="text-primary-400 border-primary-400/50">
                          +{user.subjectsInterested.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Back of card - Detailed Info
            <div className="p-6 space-y-6 min-h-[400px] absolute inset-0 rotate-y-180 backface-hidden">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-100 mb-2 font-display">More About {user.name}</h3>
                <div className="w-16 h-0.5 bg-gradient-to-r from-primary-500 to-purple-500 mx-auto"></div>
              </div>

              <div className="space-y-4">
                {/* Bio */}
                {user.bio && (
                  <div className="p-4 bg-gray-700/50 rounded-xl">
                    <h4 className="text-sm font-semibold text-gray-200 mb-2 flex items-center space-x-2">
                      <ChatBubbleLeftRightIcon className="h-4 w-4" />
                      <span>About</span>
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed">{user.bio}</p>
                  </div>
                )}

                {/* Study Goals */}
                {user.studyGoals && (
                  <div className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl border border-green-500/20">
                    <h4 className="text-sm font-semibold text-gray-200 mb-2 flex items-center space-x-2">
                      <BoltIcon className="h-4 w-4 text-green-400" />
                      <span>Study Goals</span>
                    </h4>
                    <p className="text-sm text-gray-300">{user.studyGoals}</p>
                  </div>
                )}

                {/* Languages */}
                {Array.isArray(user.personalInfo?.languages) && user.personalInfo.languages.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-200 flex items-center space-x-2">
                      <GlobeAltIcon className="h-4 w-4 text-blue-400" />
                      <span>Languages</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {user.personalInfo.languages.map((lang) => (
                        <Badge key={lang} variant="outline" size="sm" className="text-blue-400 border-blue-400/50">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats */}
                {user.stats && (
                  <div className="grid grid-cols-2 gap-3">
                    {user.stats.studySessionsCount > 0 && (
                      <div className="text-center p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
                        <div className="text-lg font-bold text-orange-400">{user.stats.studySessionsCount}</div>
                        <div className="text-xs text-gray-300">Study Sessions</div>
                      </div>
                    )}
                    {user.stats.totalStudyHours > 0 && (
                      <div className="text-center p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                        <div className="text-lg font-bold text-purple-400">{user.stats.totalStudyHours}h</div>
                        <div className="text-xs text-gray-300">Study Hours</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </Card.Body>

        {/* Action Buttons for Both Sides of the Card */}
        <div className={`absolute bottom-0 left-0 right-0 p-6 z-30 transition-opacity duration-300 ${isFlipped ? 'opacity-0' : 'opacity-100'}`}>
          <div className="flex space-x-4">
            <Button
              variant="secondary"
              onClick={onPass}
              disabled={loading}
              size="lg"
              className="flex-1 border-2 border-red-500/30 hover:border-red-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group"
            >
              <XMarkIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>Pass</span>
            </Button>
            <Button
              variant="primary"
              onClick={onLike}
              disabled={loading}
              size="lg"
              className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-400 hover:to-red-400 shadow-glow hover:shadow-glow-lg transition-all duration-300 group"
            >
              <HeartSolidIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>Like</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

/**
 * Enhanced Stats Card Component for displaying key metrics.
 */
const StatsCard = ({ icon: Icon, title, value, subtitle, color = 'primary' }) => (
  <Card className="hover:shadow-large transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-gray-800 to-gray-900 border border-primary-500/20">
    <Card.Body className="text-center space-y-3" padding="lg">
      <div
        className={`flex items-center justify-center w-12 h-12 bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-2xl mx-auto shadow-medium`}
      >
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-100 font-display">{value}</div>
        <div className="text-sm font-medium text-gray-200">{title}</div>
        {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
      </div>
    </Card.Body>
  </Card>
);

/**
 * Enhanced Home component for discovering and interacting with study partners.
 */
export default function Home() {
  const navigate = useNavigate();

  // State variables
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('discover'); // 'discover' or 'rated'

  /**
   * Effect hook for initial data fetching on component mount.
   */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    Promise.all([
      fetch('/api/users/recommendations', { headers: { Authorization: `Bearer ${token}` } }).then(
        (res) => res.json()
      ),
      fetch('/api/interactions/my', { headers: { Authorization: `Bearer ${token}` } }).then((res) =>
        res.json()
      ),
      fetch('/api/users/me', { headers: { Authorization: `Bearer ${token}` } }).then((res) =>
        res.json()
      ),
    ])
      .then(([rec, ints, user]) => {
        if (rec.success) {
          setUsers(rec.users);
        } else {
          setMessage(rec.error || 'Could not fetch recommendations.');
        }
        if (ints.success) {
          setInteractions(ints.interactions || []);
        }
        if (user.success) {
          setCurrentUser(user.user);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch initial data:', err);
        setMessage('Failed to load study partners. Please try again later.');
        setLoading(false);
      });
  }, [navigate]);

  /**
   * Memoized map of user IDs to interaction types.
   */
  const ratedMap = useMemo(() => {
    const map = {};
    interactions.forEach((i) => {
      if (i.targetUserId?._id) {
        map[i.targetUserId._id] = i.type;
      } else if (typeof i.targetUserId === 'string') {
        map[i.targetUserId] = i.type;
      }
    });
    return map;
  }, [interactions]);

  /**
   * Memoized list of users filtered by active filters and search.
   */
  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (u.subjectsInterested &&
            u.subjectsInterested.some((subject) =>
              subject.toLowerCase().includes(searchQuery.toLowerCase())
            ))
      );
    }

    // Apply other filters
    Object.entries(filters).forEach(([key, val]) => {
      if (!val) return;

      filtered = filtered.filter((u) => {
        let fieldVal = u;
        for (const k of key.split('.')) {
          if (fieldVal && typeof fieldVal === 'object') {
            fieldVal = fieldVal[k];
          } else {
            fieldVal = undefined;
            break;
          }
        }
        if (Array.isArray(fieldVal)) {
          return fieldVal.includes(val);
        }
        return fieldVal === val;
      });
    });

    // Filter based on view mode
    if (viewMode === 'discover') {
      filtered = filtered.filter((u) => !ratedMap[u._id]);
    } else {
      filtered = filtered.filter((u) => ratedMap[u._id]);
    }

    return filtered;
  }, [users, filters, searchQuery, viewMode, ratedMap]);

  // Memoized options for filter dropdowns
  const subjectOptions = useMemo(() => getUniqueOptions(users, 'subjectsInterested'), [users]);
  const languageOptions = useMemo(() => getUniqueOptions(users, 'personalInfo.languages'), [users]);
  const genderOptions = useMemo(() => getUniqueOptions(users, 'personalInfo.gender'), [users]);
  const cityOptions = useMemo(() => getUniqueOptions(users, 'location.city'), [users]);
  const stateOptions = useMemo(() => getUniqueOptions(users, 'location.state'), [users]);
  const studyTimeOptions = useMemo(() => getUniqueOptions(users, 'studyTime'), [users]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [filteredUsers.length, filters, searchQuery, viewMode]);

  const currentProfile = filteredUsers[currentIndex];

  /**
   * Handles 'like' or 'dislike' action for a user.
   */
  const handleAction = async (type, userId) => {
    setActionLoading(true);
    const token = localStorage.getItem('token');

    try {
      await fetch('/api/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ targetUserId: userId, type }),
      });

      const intsRes = await fetch('/api/interactions/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const intsData = await intsRes.json();

      if (intsData.success) {
        setInteractions(intsData.interactions || []);
      }

      // Move to next profile
      if (viewMode === 'discover') {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
    } catch (err) {
      console.error('Error performing action:', err);
      setMessage('Failed to record action. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const refreshRecommendations = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/users/recommendations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error('Failed to refresh:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout user={currentUser}>
        <div className="flex items-center justify-center min-h-96 bg-gray-900">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border border-primary-400 opacity-20"></div>
            </div>
            <div className="space-y-2">
              <p className="text-xl font-semibold text-gray-200 font-display">Finding Your Perfect Matches</p>
              <p className="text-gray-400 font-body">Analyzing compatibility and preferences...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={currentUser}>
      <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header Section */}
        <div className="text-center space-y-6 animate-fade-in-up">
          <div className="relative">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 rounded-3xl shadow-large floating">
                <SparklesIcon className="h-8 w-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-display font-bold gradient-text">Discover</h1>
                <p className="text-lg text-gray-300 font-body">Your Perfect Study Partners</p>
              </div>
            </div>

            {/* Floating particles effect */}
            <div
              className="absolute -top-4 -right-4 w-3 h-3 bg-primary-400 rounded-full animate-bounce opacity-60"
              style={{ animationDuration: '2s' }}
            ></div>
            <div
              className="absolute -bottom-2 -left-6 w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-40"
              style={{ animationDelay: '0.5s', animationDuration: '2s' }}
            ></div>
            <div
              className="absolute top-8 right-12 w-1 h-1 bg-pink-400 rounded-full animate-bounce opacity-50"
              style={{ animationDelay: '1s', animationDuration: '2s' }}
            ></div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <StatsCard
              icon={UserGroupIcon}
              title="Available"
              value={users.length}
              subtitle="study partners"
              color="blue"
            />
            <StatsCard
              icon={HeartSolidIcon}
              title="Liked"
              value={interactions.filter((i) => i.type === 'like').length}
              subtitle="people you've liked"
              color="pink"
            />
            <StatsCard
              icon={ChatBubbleLeftRightIcon}
              title="Matches"
              value={Object.keys(ratedMap).filter((id) => ratedMap[id] === 'like').length}
              subtitle="potential chats"
              color="green"
            />
            <StatsCard
              icon={FireIcon}
              title="Online"
              value={users.filter((u) => u.isOnline).length}
              subtitle="online now"
              color="orange"
            />
          </div>
        </div>

        {/* Enhanced Control Panel */}
        <Card className="bg-gradient-to-r from-gray-800 via-gray-800 to-gray-900 border border-primary-500/30 shadow-large">
          <Card.Body padding="lg">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 lg:space-x-6">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 font-body"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2 bg-gray-700/50 rounded-2xl p-1">
                <button
                  onClick={() => setViewMode('discover')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    viewMode === 'discover'
                      ? 'bg-primary-600 text-white shadow-medium'
                      : 'text-gray-300 hover:text-gray-100 hover:bg-gray-600/50'
                  }`}
                >
                  <SparklesIcon className="h-4 w-4 inline mr-2" />
                  Discover
                </button>
                <button
                  onClick={() => setViewMode('rated')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    viewMode === 'rated'
                      ? 'bg-primary-600 text-white shadow-medium'
                      : 'text-gray-300 hover:text-gray-100 hover:bg-gray-600/50'
                  }`}
                >
                  <HeartIcon className="h-4 w-4 inline mr-2" />
                  Rated ({Object.keys(ratedMap).length})
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowFilters(!showFilters)}
                  icon={FunnelIcon}
                  size="sm"
                  className="shadow-soft"
                >
                  Filters
                </Button>
                <Button
                  variant="ghost"
                  onClick={refreshRecommendations}
                  icon={ArrowPathIcon}
                  size="sm"
                  className="text-gray-400 hover:text-gray-200"
                >
                  Refresh
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Enhanced Filters Section */}
        {showFilters && (
          <Card className="animate-slide-down shadow-large bg-gradient-to-br from-gray-800 to-gray-900 border border-primary-500/20">
            <Card.Header gradient>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AdjustmentsHorizontalIcon className="h-6 w-6 text-primary-400" />
                  <h3 className="text-xl font-display font-semibold text-gray-100">Smart Filters</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)} icon={XMarkIcon} />
              </div>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Enhanced filter inputs with better styling */}
                <div className="space-y-3">
                  <label htmlFor="subject-filter" className="block text-sm font-semibold text-gray-200 font-display flex items-center space-x-2">
                    <AcademicCapIcon className="h-4 w-4 text-primary-400" />
                    <span>Subject Interest</span>
                  </label>
                  <input
                    id="subject-filter"
                    list="subject-list"
                    value={filters.subjectsInterested || ''}
                    onChange={(e) => setFilters((f) => ({ ...f, subjectsInterested: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 font-body"
                    placeholder="Any subject"
                  />
                  <datalist id="subject-list">
                    {subjectOptions.map((opt) => (
                      <option key={opt} value={opt} />
                    ))}
                  </datalist>
                </div>

                <div className="space-y-3">
                  <label htmlFor="language-filter" className="block text-sm font-semibold text-gray-200 font-display flex items-center space-x-2">
                    <GlobeAltIcon className="h-4 w-4 text-blue-400" />
                    <span>Language</span>
                  </label>
                  <select
                    id="language-filter"
                    value={filters['personalInfo.languages'] || ''}
                    onChange={(e) => setFilters((f) => ({ ...f, 'personalInfo.languages': e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 font-body"
                  >
                    <option value="">Any language</option>
                    {languageOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label htmlFor="study-time-filter" className="block text-sm font-semibold text-gray-200 font-display flex items-center space-x-2">
                    <CalendarIcon className="h-4 w-4 text-green-400" />
                    <span>Study Time</span>
                  </label>
                  <select
                    id="study-time-filter"
                    value={filters['studyTime'] || ''}
                    onChange={(e) => setFilters((f) => ({ ...f, studyTime: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 font-body"
                  >
                    <option value="">Any time</option>
                    {studyTimeOptions.map((opt) => (
                      <option key={opt} value={opt} className="capitalize">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label htmlFor="city-filter" className="block text-sm font-semibold text-gray-200 font-display flex items-center space-x-2">
                    <MapPinIcon className="h-4 w-4 text-purple-400" />
                    <span>City</span>
                  </label>
                  <input
                    id="city-filter"
                    list="city-list"
                    value={filters['location.city'] || ''}
                    onChange={(e) => setFilters((f) => ({ ...f, 'location.city': e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 font-body"
                    placeholder="Any city"
                  />
                  <datalist id="city-list">
                    {cityOptions.map((opt) => (
                      <option key={opt} value={opt} />
                    ))}
                  </datalist>
                </div>

                <div className="space-y-3">
                  <label htmlFor="state-filter" className="block text-sm font-semibold text-gray-200 font-display flex items-center space-x-2">
                    <MapPinIcon className="h-4 w-4 text-purple-400" />
                    <span>State</span>
                  </label>
                  <input
                    id="state-filter"
                    list="state-list"
                    value={filters['location.state'] || ''}
                    onChange={(e) => setFilters((f) => ({ ...f, 'location.state': e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 font-body"
                    placeholder="Any state"
                  />
                  <datalist id="state-list">
                    {stateOptions.map((opt) => (
                      <option key={opt} value={opt} />
                    ))}
                  </datalist>
                </div>

                <div className="space-y-3">
                  <label htmlFor="gender-filter" className="block text-sm font-semibold text-gray-200 font-display flex items-center space-x-2">
                    <UserGroupIcon className="h-4 w-4 text-yellow-400" />
                    <span>Gender</span>
                  </label>
                  <select
                    id="gender-filter"
                    value={filters['personalInfo.gender'] || ''}
                    onChange={(e) => setFilters((f) => ({ ...f, 'personalInfo.gender': e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 font-body"
                  >
                    <option value="">Any gender</option>
                    {genderOptions.map((opt) => (
                      <option key={opt} value={opt} className="capitalize">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-600">
                <div className="text-sm text-gray-300 font-body">
                  Showing {filteredUsers.length} of {users.length} profiles
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setFilters({})}
                  size="sm"
                  className="text-gray-400 hover:text-gray-200"
                >
                  Clear all filters
                </Button>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Main Content Area */}
        <div className="w-full">
          {viewMode === 'discover' ? (
            // Discover Mode - Single Profile Card
            currentProfile ? (
              <div className="flex justify-center animate-fade-in">
                <ProfileCard
                  user={currentProfile}
                  onLike={() => handleAction('like', currentProfile._id)}
                  onPass={() => handleAction('dislike', currentProfile._id)}
                  loading={actionLoading}
                  index={currentIndex}
                  totalUsers={filteredUsers.length}
                />
              </div>
            ) : (
              // No more profiles
              <div className="text-center py-20 animate-fade-in">
                <div className="space-y-8">
                  <div className="relative">
                    <div className="flex items-center justify-center w-32 h-32 bg-gradient-to-br from-primary-100/10 to-primary-200/10 rounded-full mx-auto border-4 border-primary-500/20">
                      <BookOpenIcon className="h-16 w-16 text-primary-400" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                      <SparklesIcon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-display font-bold text-gray-100">All Caught Up!</h3>
                    <p className="text-gray-300 max-w-md mx-auto text-balance font-body text-lg">
                      {message ||
                        "You've discovered all available study partners. Check back later for new matches or adjust your filters!"}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Button
                      variant="primary"
                      onClick={refreshRecommendations}
                      icon={ArrowPathIcon}
                      className="shadow-glow"
                    >
                      Refresh Matches
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setViewMode('rated')}
                      icon={HeartIcon}
                    >
                      View Rated Profiles
                    </Button>
                  </div>
                </div>
              </div>
            )
          ) : (
            // Rated Mode - Grid of Rated Users
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <h2 className="text-3xl font-display font-bold text-gray-100 mb-2">Your Rated Profiles</h2>
                <p className="text-gray-300 font-body">People you've already interacted with</p>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="text-center py-16">
                  <div className="space-y-6">
                    <div className="flex items-center justify-center w-24 h-24 bg-gray-700/50 rounded-full mx-auto">
                      <UserGroupIcon className="h-12 w-12 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-gray-100 font-display">No Rated Profiles</h3>
                      <p className="text-gray-300 font-body">
                        {Object.values(filters).some(Boolean)
                          ? 'No rated profiles match your filters.'
                          : 'Start discovering to rate profiles!'}
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      onClick={() => setViewMode('discover')}
                      icon={SparklesIcon}
                    >
                      Start Discovering
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredUsers.map((user) => (
                    <Card
                      key={user._id}
                      className="hover:shadow-large transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-gray-800 to-gray-900 border border-primary-500/20"
                      interactive
                    >
                      <Card.Body className="text-center space-y-4 relative">
                        {/* Rating Badge */}
                        <div className="absolute top-2 right-2">
                          <div
                            className={`p-2 rounded-full ${
                              ratedMap[user._id] === 'like'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {ratedMap[user._id] === 'like' ? (
                              <HeartSolidIcon className="h-4 w-4" />
                            ) : (
                              <XMarkIcon className="h-4 w-4" />
                            )}
                          </div>
                        </div>

                        <Avatar
                          src={user.profilePic}
                          name={user.name}
                          size="xl"
                          className="mx-auto ring-2 ring-primary-500/30"
                        />

                        <div className="space-y-2">
                          <h3 className="font-semibold text-gray-100 font-display">{user.name}</h3>
                          <div className="flex items-center justify-center space-x-2 text-sm text-gray-300 font-body">
                            {user.personalInfo?.age && <span>{user.personalInfo.age} years</span>}
                            {user.personalInfo?.gender && (
                              <>
                                <span>•</span>
                                <span className="capitalize">{user.personalInfo.gender}</span>
                              </>
                            )}
                          </div>
                          {(user.location?.city || user.location?.state) && (
                            <div className="flex items-center justify-center space-x-1 text-sm text-gray-300 font-body">
                              <MapPinIcon className="h-3 w-3" />
                              <span>
                                {user.location.city}
                                {user.location.city && user.location.state && ', '}
                                {user.location.state}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Quick action buttons */}
                        <div className="flex space-x-2 justify-center pt-2">
                          <Button
                            variant={ratedMap[user._id] === 'dislike' ? 'danger' : 'secondary'}
                            size="sm"
                            onClick={() => handleAction('dislike', user._id)}
                            disabled={actionLoading}
                            icon={XMarkIcon}
                            className="flex-1"
                          />
                          <Button
                            variant={ratedMap[user._id] === 'like' ? 'primary' : 'secondary'}
                            size="sm"
                            onClick={() => handleAction('like', user._id)}
                            disabled={actionLoading}
                            icon={ratedMap[user._id] === 'like' ? HeartSolidIcon : HeartIcon}
                            className="flex-1"
                          />
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
