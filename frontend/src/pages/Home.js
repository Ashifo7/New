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
  FunnelIcon
} from '@heroicons/react/24/outline';
import { BookOpenIcon as BookOpenSolidIcon } from '@heroicons/react/24/solid';

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
  users.forEach(u => {
    let val = u;
    // Traverse the object path to get the field value
    for (const key of fieldPath.split('.')) {
      if (val && typeof val === 'object') {
        val = val[key];
      } else {
        val = undefined; // Path does not exist or is not an object
        break;
      }
    }
    // Add values to the Set, handling arrays and single values
    if (Array.isArray(val)) {
      val.forEach(v => values.add(v));
    } else if (val) {
      values.add(val);
    }
  });
  // Convert Set to Array and filter out any falsy values (e.g., empty strings, null, undefined)
  return Array.from(values).filter(Boolean);
}

/**
 * Home component for discovering and interacting with study partners.
 * Displays user recommendations, allows filtering, and handles like/dislike actions.
 */
export default function Home() {
  const navigate = useNavigate(); // React Router hook for navigation

  // State variables for managing component data and UI
  const [users, setUsers] = useState([]); // All fetched user recommendations
  const [currentUser, setCurrentUser] = useState(null); // Current logged-in user's data
  const [interactions, setInteractions] = useState([]); // User's past interactions (likes/dislikes)
  const [loading, setLoading] = useState(true); // Overall loading state for initial data fetch
  const [message, setMessage] = useState(''); // Message to display (e.g., error, no profiles)
  const [actionLoading, setActionLoading] = useState(false); // Loading state for like/dislike actions
  const [filters, setFilters] = useState({}); // Object to store active filter values
  const [showRated, setShowRated] = useState(false); // Toggle to show/hide rated users
  const [showFilters, setShowFilters] = useState(false); // Toggle to show/hide filter options

  /**
   * Effect hook for initial data fetching on component mount.
   * Fetches user recommendations, current user's interactions, and current user's profile.
   * Navigates to login if no token is found.
   */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }

    setLoading(true); // Set loading to true before fetching data
    Promise.all([
      // Fetch user recommendations
      fetch('/api/users/recommendations', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
      // Fetch current user's interactions
      fetch('/api/interactions/my', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
      // Fetch current user's profile
      fetch('/api/users/me', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json())
    ])
      .then(([rec, ints, user]) => {
        // Update states based on API responses
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
        setLoading(false); // Set loading to false after all fetches complete
      })
      .catch((err) => {
        // Handle any errors during the fetch process
        console.error('Failed to fetch initial data:', err);
        setMessage('Failed to load study partners. Please try again later.');
        setLoading(false);
      });
  }, [navigate]); // Dependency array ensures effect runs only when navigate changes

  /**
   * Memoized map of user IDs to interaction types (like/dislike).
   * Used to quickly check if a user has already been rated.
   * Re-calculates only when 'interactions' state changes.
   */
  const ratedMap = useMemo(() => {
    const map = {};
    interactions.forEach(i => {
      // Handle both object and string targetUserId for flexibility
      if (i.targetUserId?._id) {
        map[i.targetUserId._id] = i.type;
      } else if (typeof i.targetUserId === 'string') {
        map[i.targetUserId] = i.type;
      }
    });
    return map;
  }, [interactions]);

  /**
   * Memoized list of users filtered by active filters and 'showRated' toggle.
   * This is the list of users currently displayed for swiping/rating.
   * Re-calculates only when 'users', 'filters', 'showRated', or 'ratedMap' change.
   */
  const filteredUsers = useMemo(() => {
    let filtered = users;
    // Apply filters from the 'filters' state object
    Object.entries(filters).forEach(([key, val]) => {
      if (!val) return; // Skip if filter value is empty

      filtered = filtered.filter(u => {
        let fieldVal = u;
        // Traverse the object path for the filter key
        for (const k of key.split('.')) {
          if (fieldVal && typeof fieldVal === 'object') {
            fieldVal = fieldVal[k];
          } else {
            fieldVal = undefined;
            break;
          }
        }
        // Check if the user's field value matches the filter value
        if (Array.isArray(fieldVal)) {
          return fieldVal.includes(val);
        }
        return fieldVal === val;
      });
    });

    // Filter out already rated users if 'showRated' is false
    if (!showRated) {
      filtered = filtered.filter(u => !ratedMap[u._id]);
    }
    return filtered;
  }, [users, filters, showRated, ratedMap]);

  /**
   * Memoized list of users who have already been rated (liked/disliked).
   * This list is displayed when 'showRated' is true.
   * Re-calculates only when 'users', 'ratedMap', or 'filters' change.
   */
  const ratedUsers = useMemo(() => {
    let filtered = users.filter(u => ratedMap[u._id]); // Start with only rated users
    // Apply filters to the rated users list
    Object.entries(filters).forEach(([key, val]) => {
      if (!val) return;

      filtered = filtered.filter(u => {
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
    return filtered;
  }, [users, ratedMap, filters]);

  // Memoized options for filter dropdowns/datalists
  const subjectOptions = useMemo(() => getUniqueOptions(users, 'subjectsInterested'), [users]);
  const languageOptions = useMemo(() => getUniqueOptions(users, 'personalInfo.languages'), [users]);
  const genderOptions = useMemo(() => getUniqueOptions(users, 'personalInfo.gender'), [users]);
  const cityOptions = useMemo(() => getUniqueOptions(users, 'location.city'), [users]);
  const stateOptions = useMemo(() => getUniqueOptions(users, 'location.state'), [users]);
  const studyTimeOptions = useMemo(() => getUniqueOptions(users, 'studyTime'), [users]);

  // State to manage the index of the currently displayed user in 'filteredUsers'
  const [filteredIndex, setFilteredIndex] = useState(0);
  /**
   * Effect hook to reset the 'filteredIndex' when the list of filtered users changes
   * (e.g., due to new filters or toggling 'showRated').
   */
  useEffect(() => {
    setFilteredIndex(0);
  }, [filteredUsers.length, filters, showRated]); // Dependencies ensure reset when relevant data changes

  // Get the current user to display based on 'filteredIndex'
  const current = filteredUsers[filteredIndex];

  /**
   * Handles 'like' or 'dislike' action for a user.
   * Sends the interaction to the API and updates the interactions state.
   * @param {string} type - The type of interaction ('like' or 'dislike').
   * @param {string} userId - The ID of the user being interacted with.
   */
  const handleAction = async (type, userId) => {
    setActionLoading(true); // Show action loading indicator
    const token = localStorage.getItem('token');

    try {
      // Send interaction to the backend
      await fetch('/api/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ targetUserId: userId, type })
      });

      // Re-fetch interactions to update the UI and ratedMap
      const intsRes = await fetch('/api/interactions/my', { headers: { Authorization: `Bearer ${token}` } });
      const intsData = await intsRes.json();

      if (intsData.success) {
        setInteractions(intsData.interactions || []);
      } else {
        console.error('Failed to re-fetch interactions:', intsData.error);
        setMessage('Action recorded, but failed to update interactions list.');
      }
    } catch (err) {
      console.error('Error performing action:', err);
      setMessage('Failed to record action. Please try again.');
    } finally {
      setActionLoading(false); // Hide action loading indicator
      // Advance to the next profile if not showing rated users
      if (!showRated) {
        setFilteredIndex(prevIndex => prevIndex + 1);
      }
    }
  };

  // Display loading spinner while initial data is being fetched
  if (loading) {
    return (
      <Layout user={currentUser}>
        <div className="flex items-center justify-center min-h-96 bg-gray-900">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-secondary-600">Finding your perfect study matches...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={currentUser}>
      <div className="max-w-4xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-8"> {/* Added padding for overall layout */}
        {/* Header Section */}
        <div className="text-center space-y-4 animate-fade-in-up">
          <div className="flex items-center justify-center space-x-3">
            <SparklesIcon className="h-8 w-8 text-primary-600" />
            <h1 className="text-4xl font-display font-bold gradient-text">Discover Study Partners</h1>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto text-balance font-body">
            Find your perfect study match and accelerate your learning journey together
          </p>

          {/* Matches count and Filters button */}
          <div className="flex items-center justify-center space-x-6 pt-4">
            <div className="flex items-center space-x-2 text-sm text-gray-400 font-body">
              <UserGroupIcon className="h-5 w-5 text-primary-500" />
              <span>{users.length} potential matches</span>
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              icon={FunnelIcon}
              size="sm"
              className="shadow-soft"
            >
              Filters
            </Button>
          </div>
        </div>

        {/* Filters Section (conditionally rendered) */}
        {showFilters && (
          <Card className="animate-slide-down shadow-large">
            <Card.Header gradient>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-200" />
                  <h3 className="text-lg font-display font-semibold text-gray-100">Filter Options</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                  icon={XMarkIcon}
                  aria-label="Close filters"
                />
              </div>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Subject Filter */}
                <div className="space-y-2">
                  <label htmlFor="subject-filter" className="block text-sm font-semibold text-gray-200 font-display">Subject</label>
                  <input
                    id="subject-filter"
                    list="subject-list"
                    value={filters.subjectsInterested || ''}
                    onChange={e => setFilters(f => ({ ...f, subjectsInterested: e.target.value }))}
                    className="block w-full px-4 py-3 text-sm bg-gray-800 border border-gray-600 rounded-xl shadow-soft focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 ease-out hover:border-gray-500 text-gray-100 font-body"
                    placeholder="Any subject"
                  />
                  <datalist id="subject-list">
                    {subjectOptions.map(opt => <option key={opt} value={opt} />)}
                  </datalist>
                </div>

                {/* Language Filter */}
                <div className="space-y-2">
                  <label htmlFor="language-filter" className="block text-sm font-semibold text-gray-200 font-display">Language</label>
                  <select
                    id="language-filter"
                    value={filters['personalInfo.languages'] || ''}
                    onChange={e => setFilters(f => ({ ...f, 'personalInfo.languages': e.target.value }))}
                    className="block w-full px-4 py-3 text-sm bg-gray-800 border border-gray-600 rounded-xl shadow-soft focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 ease-out hover:border-gray-500 text-gray-100 font-body"
                  >
                    <option value="">Any language</option>
                    {languageOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                {/* Gender Filter */}
                <div className="space-y-2">
                  <label htmlFor="gender-filter" className="block text-sm font-semibold text-gray-200 font-display">Gender</label>
                  <select
                    id="gender-filter"
                    value={filters['personalInfo.gender'] || ''}
                    onChange={e => setFilters(f => ({ ...f, 'personalInfo.gender': e.target.value }))}
                    className="block w-full px-4 py-3 text-sm bg-gray-800 border border-gray-600 rounded-xl shadow-soft focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 ease-out hover:border-gray-500 text-gray-100 font-body"
                  >
                    <option value="">Any gender</option>
                    {genderOptions.map(opt => <option key={opt} value={opt} className="capitalize">{opt}</option>)}
                  </select>
                </div>

                {/* City Filter */}
                <div className="space-y-2">
                  <label htmlFor="city-filter" className="block text-sm font-semibold text-gray-200 font-display">City</label>
                  <input
                    id="city-filter"
                    list="city-list"
                    value={filters['location.city'] || ''}
                    onChange={e => setFilters(f => ({ ...f, 'location.city': e.target.value }))}
                    className="block w-full px-4 py-3 text-sm bg-gray-800 border border-gray-600 rounded-xl shadow-soft focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 ease-out hover:border-gray-500 text-gray-100 font-body"
                    placeholder="Any city"
                  />
                  <datalist id="city-list">
                    {cityOptions.map(opt => <option key={opt} value={opt} />)}
                  </datalist>
                </div>

                {/* State Filter */}
                <div className="space-y-2">
                  <label htmlFor="state-filter" className="block text-sm font-semibold text-gray-200 font-display">State</label>
                  <input
                    id="state-filter"
                    list="state-list"
                    value={filters['location.state'] || ''}
                    onChange={e => setFilters(f => ({ ...f, 'location.state': e.target.value }))}
                    className="block w-full px-4 py-3 text-sm bg-gray-800 border border-gray-600 rounded-xl shadow-soft focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 ease-out hover:border-gray-500 text-gray-100 font-body"
                    placeholder="Any state"
                  />
                  <datalist id="state-list">
                    {stateOptions.map(opt => <option key={opt} value={opt} />)}
                  </datalist>
                </div>

                {/* Study Time Filter */}
                <div className="space-y-2">
                  <label htmlFor="studytime-filter" className="block text-sm font-semibold text-gray-200 font-display">Study Time</label>
                  <input
                    id="studytime-filter"
                    list="studytime-list"
                    value={filters['studyTime'] || ''}
                    onChange={e => setFilters(f => ({ ...f, 'studyTime': e.target.value }))}
                    className="block w-full px-4 py-3 text-sm bg-gray-800 border border-gray-600 rounded-xl shadow-soft focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 ease-out hover:border-gray-500 text-gray-100 font-body"
                    placeholder="Any time"
                  />
                  <datalist id="studytime-list">
                    {studyTimeOptions.map(opt => <option key={opt} value={opt} className="capitalize" />)}
                  </datalist>
                </div>
              </div>

              {/* Show Rated Users checkbox and Clear Filters button */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-600">
                <label htmlFor="show-rated-checkbox" className="flex items-center space-x-3 cursor-pointer">
                  <input
                    id="show-rated-checkbox"
                    type="checkbox"
                    checked={showRated}
                    onChange={e => setShowRated(e.target.checked)}
                    className="rounded border-gray-500 text-primary-600 focus:ring-primary-500 h-4 w-4"
                  />
                  <span className="text-sm font-medium text-gray-200 font-body">Show rated users</span>
                </label>

                <Button
                  variant="ghost"
                  onClick={() => setFilters({})} // Clear all filters
                  size="sm"
                  className="text-gray-400 hover:text-gray-200"
                >
                  Clear all filters
                </Button>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Main Content Area: Displays current user or rated users */}
        {!showRated ? (
          // Display current user for swiping
          current ? (
            <div className="flex justify-center animate-fade-in">
              <Card className="w-full max-w-sm shadow-large hover:shadow-glow transition-all duration-500">
                <Card.Body className="text-center space-y-6" padding="lg">
                  <div className="relative">
                    <Avatar
                      src={current.profilePic}
                      name={current.name}
                      size="3xl"
                      className="mx-auto ring-4 ring-white shadow-large"
                    />
                    {/* Profile index badge */}
                    <div className="absolute -bottom-2 -right-2 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-medium">
                      #{filteredIndex + 1}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-2xl font-display font-bold text-gray-100">{current.name}</h2>
                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-300 font-body">
                      {current.personalInfo?.age && (
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">{current.personalInfo.age}</span>
                          <span>years</span>
                        </div>
                      )}
                      {current.personalInfo?.gender && (
                        <Badge variant="outline" size="sm" className="capitalize">
                          {current.personalInfo.gender}
                        </Badge>
                      )}
                    </div>

                    {(current.location?.city || current.location?.state) && (
                      <div className="flex items-center justify-center space-x-1 text-gray-300 font-body">
                        <MapPinIcon className="h-4 w-4" />
                        <span className="text-sm">
                          {current.location.city}{current.location.city && current.location.state && ', '}{current.location.state}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {Array.isArray(current.subjectsInterested) && current.subjectsInterested.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-200 flex items-center justify-center space-x-1 font-display">
                          <SparklesIcon className="h-4 w-4" />
                          <span>Subjects</span>
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {current.subjectsInterested.slice(0, 4).map(subject => (
                            <Badge key={subject} variant="primary" size="sm">
                              {subject}
                            </Badge>
                          ))}
                          {current.subjectsInterested.length > 4 && (
                            <Badge variant="outline" size="sm">
                              +{current.subjectsInterested.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {Array.isArray(current.personalInfo?.languages) && current.personalInfo.languages.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-200 font-display">Languages</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {current.personalInfo.languages.slice(0, 3).map(lang => (
                            <Badge key={lang} variant="default" size="sm">
                              {lang}
                            </Badge>
                          ))}
                          {current.personalInfo.languages.length > 3 && (
                            <Badge variant="outline" size="sm">
                              +{current.personalInfo.languages.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {current.studyTime && (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-200 flex items-center justify-center space-x-1 font-display">
                          <ClockIcon className="h-4 w-4" />
                          <span>Preferred Study Time</span>
                        </p>
                        <Badge variant="success" className="capitalize">
                          {current.studyTime}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons: Pass and Like */}
                  <div className="flex space-x-4 pt-6">
                    <Button
                      variant="secondary"
                      onClick={() => handleAction('dislike', current._id)}
                      disabled={actionLoading}
                      icon={XMarkIcon}
                      size="lg"
                      className="flex-1 border-2 hover:border-danger-300 hover:text-danger-600"
                    >
                      Pass
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => handleAction('like', current._id)}
                      disabled={actionLoading}
                      icon={BookOpenIcon}
                      size="lg"
                      className="flex-1 shadow-glow"
                    >
                      Like
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ) : (
            // No more profiles to show
            <div className="text-center py-16 animate-fade-in">
              <div className="space-y-6">
                <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-r from-primary-100 to-primary-200 rounded-full mx-auto">
                  <BookOpenIcon className="h-12 w-12 text-primary-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-display font-bold text-gray-100">No more profiles</h3>
                  <p className="text-gray-300 max-w-md mx-auto text-balance font-body">
                    {message || 'You\'ve seen all available study partners. Check back later for new matches!'}
                  </p>
                </div>
                <Button
                  variant="primary"
                  onClick={() => window.location.reload()} // Reload page to fetch new recommendations
                  icon={SparklesIcon}
                  className="shadow-medium"
                >
                  Refresh Matches
                </Button>
              </div>
            </div>
          )
        ) : (
          // Display rated users
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <h2 className="text-2xl font-display font-bold text-gray-100">Rated Users</h2>
              <p className="text-gray-300 mt-2 font-body">Users you've already interacted with</p>
            </div>

            {ratedUsers.length === 0 ? (
              // No rated users or none match filters
              <div className="text-center py-16">
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-gray-700 rounded-full mx-auto">
                    <UserGroupIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-300 font-body">
                    {Object.values(filters).some(Boolean) ? 'No rated users match your filters.' : 'No rated users yet.'}
                  </p>
                </div>
              </div>
            ) : (
              // Grid of rated users
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ratedUsers.map(user => (
                  <Card key={user._id} className="hover:shadow-large transition-all duration-300 hover:-translate-y-1" interactive>
                    <Card.Body className="text-center space-y-4">
                      <Avatar
                        src={user.profilePic}
                        name={user.name}
                        size="xl"
                        className="mx-auto"
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
                              {user.location.city}{user.location.city && user.location.state && ', '}{user.location.state}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons for rated users (to change interaction type) */}
                      <div className="flex space-x-2 justify-center">
                        <Button
                          variant={ratedMap[user._id] === 'dislike' ? 'danger' : 'secondary'}
                          size="sm"
                          onClick={() => handleAction('dislike', user._id)}
                          disabled={actionLoading}
                          icon={XMarkIcon}
                        />
                        <Button
                          variant={ratedMap[user._id] === 'like' ? 'primary' : 'secondary'}
                          size="sm"
                          onClick={() => handleAction('like', user._id)}
                          disabled={actionLoading}
                          icon={ratedMap[user._id] === 'like' ? BookOpenSolidIcon : BookOpenIcon}
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
    </Layout>
  );
}
