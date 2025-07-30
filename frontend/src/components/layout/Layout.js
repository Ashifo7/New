import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HeartIcon,
  HomeIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  InformationCircleIcon,
  EnvelopeIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeSolidIcon,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightSolidIcon,
  UserIcon as UserSolidIcon,
  InformationCircleIcon as InformationCircleSolidIcon,
  EnvelopeIcon as EnvelopeSolidIcon
} from '@heroicons/react/24/solid';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

const Layout = ({ children, user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navigationItems = [
    {
      id: 'home',
      label: 'Home',
      path: '/home',
      icon: HomeIcon,
      solidIcon: HomeSolidIcon,
      description: 'Discover study partners'
    },
    {
      id: 'about',
      label: 'About',
      path: '/landing#about',
      icon: InformationCircleIcon,
      solidIcon: InformationCircleSolidIcon,
      description: 'Learn about StudyBuddy'
    },
    {
      id: 'messages',
      label: 'Messages',
      path: '/matches',
      icon: ChatBubbleLeftRightIcon,
      solidIcon: ChatBubbleLeftRightSolidIcon,
      description: 'Chat with matches'
    },
    {
      id: 'contact',
      label: 'Contact',
      path: '/landing#contact',
      icon: EnvelopeIcon,
      solidIcon: EnvelopeSolidIcon,
      description: 'Get in touch'
    },
    {
      id: 'profile',
      label: 'Profile',
      path: '/profile-complete',
      icon: UserIcon,
      solidIcon: UserSolidIcon,
      description: 'Manage your profile'
    }
  ];

  const isActive = (path) => {
    if (path.includes('#')) {
      const basePath = path.split('#')[0];
      return location.pathname === basePath;
    }
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    if (path.includes('#')) {
      const [basePath, section] = path.split('#');
      navigate(basePath);
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation Bar */}
      <nav className="bg-gray-800/95 backdrop-blur-xl border-b border-primary-600/30 sticky top-0 z-50 shadow-large">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => navigate('/landing')}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-medium group-hover:shadow-glow transition-all duration-300">
                <HeartIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text font-display">StudyBuddy</h1>
                <p className="text-xs text-gray-400 font-body">Find your study partner</p>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = isActive(item.path) ? item.solidIcon : item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.path)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ease-out font-display group relative ${
                      isActive(item.path)
                        ? 'bg-primary-600/20 text-primary-300 shadow-soft'
                        : 'text-gray-300 hover:text-gray-100 hover:bg-gray-700/60'
                    }`}
                  >
                    <Icon className={`h-5 w-5 transition-transform duration-300 ${
                      isActive(item.path) ? 'scale-110' : 'group-hover:scale-110'
                    }`} />
                    <span>{item.label}</span>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                      {item.description}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-700"></div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* User Section */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-semibold text-gray-100 font-display">{user.name}</p>
                    <p className="text-xs text-success-400 flex items-center justify-end space-x-1 font-body">
                      <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                      <span>Online</span>
                    </p>
                  </div>
                  
                  <Avatar
                    src={user.profilePic}
                    name={user.name}
                    size="md"
                    className="ring-2 ring-primary-500/30 hover:ring-primary-500/60 transition-all duration-300 cursor-pointer"
                    onClick={() => navigate('/profile-complete')}
                  />
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    icon={ArrowRightOnRectangleIcon}
                    className="text-gray-400 hover:text-gray-200"
                  >
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/login')}
                    size="sm"
                  >
                    Login
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => navigate('/signup')}
                    size="sm"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden pb-4">
            <div className="flex items-center justify-center space-x-1 overflow-x-auto">
              {navigationItems.map((item) => {
                const Icon = isActive(item.path) ? item.solidIcon : item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.path)}
                    className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ease-out font-display min-w-0 ${
                      isActive(item.path)
                        ? 'bg-primary-600/20 text-primary-300'
                        : 'text-gray-300 hover:text-gray-100 hover:bg-gray-700/60'
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 py-8 px-6 sm:px-8 lg:px-12">
        {children}
      </main>
    </div>
  );
};

export default Layout;