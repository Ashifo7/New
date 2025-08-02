import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  BookOpenIcon,
  SparklesIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ArrowRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  InformationCircleIcon,
  PlayIcon,
  CheckIcon,
  StarIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  HeartIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  BoltIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { BookOpenIcon as BookOpenSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

// Assuming these components are available in the project
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Layout from '../components/layout/Layout';
import RotatingText from '../components/RotatingText';
import Particles from '../components/Particles';

/**
 * Enhanced Feature Card with hover animations and modern design
 */
const FeatureCard = ({ icon: Icon, title, description, gradient, delay = 0 }) => (
  <Card
    className={`group relative overflow-hidden bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-primary-500/20 shadow-2xl hover:shadow-glow-xl transition-all duration-700 hover:-translate-y-4 hover:scale-105 animate-fade-in-up`}
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* Magic Bento Hover Effect */}
    <div className="absolute inset-0 z-0 bg-shuttle-gradient bg-[length:200%_200%] opacity-0 transition-opacity duration-500 group-hover:opacity-100 animate-magic-bento-pulse"></div>

    <Card.Body className="relative z-10 text-center space-y-6 p-8">
      <div className="relative">
        <div className="flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-500">
          <Icon className="h-10 w-10 text-white drop-shadow-lg" />
        </div>
        <div className="absolute -inset-4 bg-white/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
      <h3 className="text-2xl font-bold text-white font-display drop-shadow-lg">{title}</h3>
      <p className="text-white/90 leading-relaxed text-lg font-body drop-shadow-sm">{description}</p>
    </Card.Body>
  </Card>
);

/**
 * Animated Statistics Counter
 */
const StatCounter = ({ end, duration = 2000, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref} className="font-bold">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

/**
 * Interactive Testimonial Card with enhanced design
 */
const TestimonialCard = ({ quote, author, role, avatar, rating = 5, delay = 0 }) => (
  <Card
    className={`group relative overflow-hidden bg-gradient-to-br from-gray-800/90 via-gray-800/95 to-gray-900/90 backdrop-blur-xl border border-primary-500/30 shadow-2xl hover:shadow-glow-xl transition-all duration-700 hover:-translate-y-2 animate-fade-in-up`}
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* Magic Bento Hover Effect */}
    <div className="absolute inset-0 z-0 bg-shuttle-gradient bg-[length:200%_200%] opacity-0 transition-opacity duration-500 group-hover:opacity-100 animate-magic-bento-pulse"></div>

    <Card.Body className="relative z-10 space-y-6 p-8">
      {/* Rating Stars */}
      <div className="flex items-center justify-center space-x-1">
        {[...Array(rating)].map((_, i) => (
          <StarSolidIcon key={i} className="h-5 w-5 text-yellow-400" />
        ))}
      </div>
      
      {/* Quote */}
      <blockquote className="text-lg text-gray-200 italic leading-relaxed font-body text-center">
        "{quote}"
      </blockquote>
      
      {/* Author */}
      <div className="flex items-center justify-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
          {author.charAt(0)}
        </div>
        <div className="text-center">
          <p className="font-semibold text-gray-100 font-display">{author}</p>
          <p className="text-sm text-gray-300 font-body">{role}</p>
        </div>
      </div>
    </Card.Body>
  </Card>
);

/**
 * Interactive Process Step
 */
const ProcessStep = ({ step, title, description, icon: Icon, delay = 0 }) => (
  <div
    className={`group relative text-center space-y-6 animate-fade-in-up`}
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* Step Number */}
    <div className="relative">
      <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mx-auto shadow-2xl group-hover:scale-110 transition-all duration-500 group-hover:shadow-glow">
        <span className="text-2xl font-bold text-white font-display">{step}</span>
      </div>
      <div className="absolute -inset-4 bg-primary-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
    
    {/* Icon */}
    <div className="flex items-center justify-center">
      <Icon className="h-8 w-8 text-primary-400 group-hover:text-primary-300 transition-colors duration-300" />
    </div>
    
    {/* Content */}
    <div className="space-y-3">
      <h3 className="text-xl font-bold text-gray-100 font-display group-hover:text-primary-300 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-300 leading-relaxed font-body max-w-sm mx-auto">
        {description}
      </p>
    </div>
  </div>
);

/**
 * Enhanced Contact Section with modern design
 */
const ContactSection = () => (
  <section id="contact" className="py-32 relative overflow-hidden">
    {/* Background Elements */}
    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 via-gray-900/80 to-black/90"></div>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.1),transparent_50%)]"></div>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]"></div>
    
    <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
      <div className="text-center mb-20 animate-fade-in-up">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl shadow-2xl mb-8 floating">
          <EnvelopeIcon className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-5xl font-display font-bold text-gray-100 mb-8">
          Let's Start a <span className="gradient-text">Conversation</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto font-body leading-relaxed">
          Have questions about StudyBuddy? We'd love to hear from you and help you on your learning journey.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Contact Information */}
        <div className="space-y-8 animate-fade-in-up">
          <div className="space-y-8">
            {/* Email Contact */}
            <div className="group flex items-start space-x-6 p-6 rounded-2xl bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm border border-primary-500/20 hover:border-primary-500/40 transition-all duration-300 hover:shadow-glow">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <EnvelopeIcon className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-100 font-display mb-2">Email Us</h4>
                <p className="text-primary-400 font-body text-lg mb-1">support@studybuddy.com</p>
                <p className="text-sm text-gray-400 font-body">We'll respond within 24 hours</p>
              </div>
            </div>

            {/* Phone Contact */}
            <div className="group flex items-start space-x-6 p-6 rounded-2xl bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm border border-primary-500/20 hover:border-primary-500/40 transition-all duration-300 hover:shadow-glow">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <PhoneIcon className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-100 font-display mb-2">Call Us</h4>
                <p className="text-green-400 font-body text-lg mb-1">+1 (555) 123-4567</p>
                <p className="text-sm text-gray-400 font-body">Mon-Fri, 9AM-6PM EST</p>
              </div>
            </div>

            {/* Office Address */}
            <div className="group flex items-start space-x-6 p-6 rounded-2xl bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm border border-primary-500/20 hover:border-primary-500/40 transition-all duration-300 hover:shadow-glow">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <MapPinIcon className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-100 font-display mb-2">Visit Us</h4>
                <p className="text-purple-400 font-body text-lg mb-1">123 Education Street</p>
                <p className="text-purple-400 font-body text-lg">Learning City, LC 12345</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <Card className="animate-fade-in-up shadow-2xl bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-primary-500/30">
          <Card.Body padding="lg" className="space-y-8">
            <div className="text-center">
              <h3 className="text-3xl font-display font-bold text-gray-100 mb-4">
                Send us a Message
              </h3>
              <p className="text-gray-300 font-body">We'd love to hear from you</p>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-semibold text-gray-200 font-display">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 font-body backdrop-blur-sm"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-semibold text-gray-200 font-display">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 font-body backdrop-blur-sm"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-200 font-display">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 font-body backdrop-blur-sm"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-semibold text-gray-200 font-display">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 resize-none font-body backdrop-blur-sm"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <Button
                type="submit"
                fullWidth
                size="lg"
                icon={EnvelopeIcon}
                className="shadow-glow hover:shadow-glow-lg bg-gradient-to-r from-primary-600 via-primary-500 to-purple-600 hover:from-primary-500 hover:via-primary-400 hover:to-purple-500"
              >
                Send Message
              </Button>
            </form>
          </Card.Body>
        </Card>
      </div>
    </div>
  </section>
);

// Enhanced testimonials data
const testimonials = [
  {
    quote: "StudyBuddy completely transformed my learning experience. I found amazing study partners who share my passion for computer science, and together we've tackled complex algorithms and projects that seemed impossible alone.",
    author: "Sarah Chen",
    role: "Computer Science Student at MIT",
    rating: 5
  },
  {
    quote: "The collaborative environment StudyBuddy creates is incredible. I've not only improved my grades significantly but also made lifelong friendships through shared learning goals and late-night study sessions.",
    author: "Marcus Johnson",
    role: "Medical Student at Harvard",
    rating: 5
  },
  {
    quote: "As someone who struggled with motivation, StudyBuddy's matching system helped me find accountability partners who keep me on track. My productivity has increased by 300% since joining!",
    author: "Priya Patel",
    role: "Engineering Student at Stanford",
    rating: 5
  },
  {
    quote: "The secure messaging and study session planning features make it so easy to coordinate with my study group. StudyBuddy is truly a game-changer for collaborative learning in the digital age.",
    author: "Alex Rodriguez",
    role: "Business Student at Wharton",
    rating: 5
  }
];

/**
 * Main Landing Component with enhanced design and animations
 */
export default function Landing() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    fetch('/api/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCurrentUser(data.user);
        } else {
          console.error('Failed to fetch current user:', data.error);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching current user:', err);
        setLoading(false);
      });
  }, [navigate]);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'how-it-works', 'testimonials', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDiscover = () => {
    if (currentUser && currentUser.profileComplete) {
      navigate('/home');
    } else {
      navigate('/profile-complete');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
        <Particles className="absolute inset-0 z-0" />
        <div className="relative z-10 text-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border border-primary-400 opacity-20"></div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-semibold text-gray-200 font-display">Preparing Your Experience</p>
            <p className="text-gray-400 font-body">Loading the future of collaborative learning...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout user={currentUser}>
      <div className="min-h-screen bg-gray-900 relative overflow-hidden">
        {/*
          // NOTE: A style block is added here to define the custom keyframes and gradient for the hover effect.
          // This is a common practice for self-contained components with custom animations in Tailwind CSS.
          // The `animate-magic-bento-pulse` class is a custom animation to make the gradient move.
          // The `bg-shuttle-gradient` class defines the gradient itself.
        */}
        <style jsx>{`
          .bg-shuttle-gradient {
            background-image: radial-gradient(
              circle at center,
              #8b5cf6,
              #5b21b6,
              #3b0764,
              #1e1b4b
            );
          }
          @keyframes magic-bento-pulse {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}</style>

        {/* Enhanced Particles Background */}
        <Particles
          className="absolute inset-0 z-0"
          particleCount={300}
          particleColors={['#9333ea', '#3b82f6', '#06b6d4', '#8b5cf6']}
          moveParticlesOnHover={true}
          particleHoverFactor={2}
          alphaParticles={true}
        />

        {/* Main Content Container */}
        <div className="relative z-10">
          {/* Enhanced Hero Section */}
          <section id="home" className="min-h-screen flex items-center justify-center py-24 lg:py-32 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-transparent to-purple-900/20"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(147,51,234,0.1),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
            
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center relative z-10">
              <div className="space-y-12 mb-16 animate-fade-in-up">
                {/* Logo and Brand */}
                <div className="flex items-center justify-center space-x-6 mb-12">
                  <div className="relative">
                    <div className="flex items-center justify-center w-28 h-28 bg-gradient-to-br from-primary-500 via-primary-600 to-purple-600 rounded-3xl shadow-2xl floating">
                      <BookOpenIcon className="h-14 w-14 text-white drop-shadow-lg" />
                    </div>
                    <div className="absolute -inset-4 bg-primary-500/30 rounded-full blur-2xl opacity-60 animate-pulse"></div>
                  </div>
                </div>

                {/* Main Headline */}
                <div className="space-y-8">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-100 leading-tight">
                    <span className="block mb-4">Find Your Perfect</span>
                    <RotatingText
                      texts={['Study Partner', 'Learning Buddy', 'Academic Ally', 'Study Companion']}
                      mainClassName="gradient-text inline-flex items-center justify-center"
                      staggerFrom={"last"}
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "-120%" }}
                      staggerDuration={0.025}
                      splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                      transition={{ type: "spring", damping: 30, stiffness: 400 }}
                      rotationInterval={3000}
                    />
                  </h1>

                  <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-body">
                    Join <span className="text-primary-400 font-semibold">50,000+</span> students who have transformed their learning experience through
                    meaningful connections, collaborative study sessions, and shared academic success.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8">
                  <Button
                    onClick={handleDiscover}
                    size="lg"
                    icon={RocketLaunchIcon}
                    className="shadow-glow hover:shadow-glow-lg text-lg px-8 py-4 bg-gradient-to-r from-primary-600 via-primary-500 to-purple-600 hover:from-primary-500 hover:via-primary-400 hover:to-purple-500 transform hover:scale-105"
                  >
                    Start Your Journey
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => setIsVideoPlaying(true)}
                    icon={PlayIcon}
                    className="shadow-medium text-lg px-8 py-4 bg-gray-800/80 backdrop-blur-sm border-2 border-primary-500/30 hover:border-primary-500/60"
                  >
                    Watch Demo
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-16">
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold gradient-text font-display">
                      <StatCounter end={50000} suffix="+" />
                    </div>
                    <p className="text-gray-300 font-body text-sm">Active Students</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold gradient-text font-display">
                      <StatCounter end={1000000} suffix="+" />
                    </div>
                    <p className="text-gray-300 font-body text-sm">Study Sessions</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold gradient-text font-display">
                      <StatCounter end={95} suffix="%" />
                    </div>
                    <p className="text-gray-300 font-body text-sm">Success Rate</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold gradient-text font-display">
                      <StatCounter end={150} suffix="+" />
                    </div>
                    <p className="text-gray-300 font-body text-sm">Universities</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced Features Section */}
          <section id="about" className="py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800/30 via-gray-900/50 to-black/70"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.05),transparent_70%)]"></div>
            
            <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
              <div className="text-center mb-20 animate-fade-in-up">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl shadow-2xl mb-8 floating">
                  <SparklesIcon className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-100 mb-8">
                  Why Students <span className="gradient-text">Love</span> StudyBuddy
                </h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto font-body leading-relaxed">
                  Discover the revolutionary features that make collaborative learning effective, engaging, and enjoyable
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                <FeatureCard
                  icon={BoltIcon}
                  title="AI-Powered Matching"
                  description="Our advanced algorithm analyzes your learning style, schedule, and goals to find your perfect study companions."
                  gradient="from-yellow-500 to-orange-600"
                  delay={100}
                />
                <FeatureCard
                  icon={ShieldCheckIcon}
                  title="Secure & Private"
                  description="End-to-end encrypted messaging ensures your conversations and study materials remain completely private."
                  gradient="from-green-500 to-emerald-600"
                  delay={200}
                />
                <FeatureCard
                  icon={GlobeAltIcon}
                  title="Global Community"
                  description="Connect with students from top universities worldwide and expand your academic network globally."
                  gradient="from-blue-500 to-cyan-600"
                  delay={300}
                />
                <FeatureCard
                  icon={AcademicCapIcon}
                  title="Academic Excellence"
                  description="Track your progress, set goals, and achieve better grades through collaborative learning and peer support."
                  gradient="from-purple-500 to-pink-600"
                  delay={400}
                />
                <FeatureCard
                  icon={ChatBubbleLeftRightIcon}
                  title="Smart Communication"
                  description="Integrated chat, video calls, and study session planning tools keep you connected and organized."
                  gradient="from-indigo-500 to-purple-600"
                  delay={500}
                />
                <FeatureCard
                  icon={FireIcon}
                  title="Gamified Learning"
                  description="Earn achievements, build streaks, and stay motivated with our engaging gamification system."
                  gradient="from-red-500 to-pink-600"
                  delay={600}
                />
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section id="how-it-works" className="py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900/10 via-transparent to-purple-900/10"></div>
            
            <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
              <div className="text-center mb-20 animate-fade-in-up">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl shadow-2xl mb-8 floating">
                  <LightBulbIcon className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-100 mb-8">
                  How It <span className="gradient-text">Works</span>
                </h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto font-body leading-relaxed">
                  Get started in minutes and transform your learning experience forever
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
                <ProcessStep
                  step="1"
                  title="Create Your Profile"
                  description="Tell us about your subjects, learning style, and academic goals to help us find your perfect matches."
                  icon={UserGroupIcon}
                  delay={100}
                />
                <ProcessStep
                  step="2"
                  title="Get Matched"
                  description="Our AI algorithm analyzes thousands of data points to connect you with compatible study partners."
                  icon={SparklesIcon}
                  delay={200}
                />
                <ProcessStep
                  step="3"
                  title="Start Learning"
                  description="Begin collaborating, sharing resources, and achieving your academic goals together."
                  icon={RocketLaunchIcon}
                  delay={300}
                />
              </div>
            </div>
          </section>

          {/* Enhanced Testimonials Section */}
          <section id="testimonials" className="py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 via-gray-900/70 to-black/90"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(147,51,234,0.1),transparent_50%)]"></div>
            
            <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
              <div className="text-center mb-20 animate-fade-in-up">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl shadow-2xl mb-8 floating">
                  <StarIcon className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-100 mb-8">
                  Student <span className="gradient-text">Success Stories</span>
                </h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto font-body leading-relaxed">
                  Real experiences from students who transformed their academic journey with StudyBuddy
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {testimonials.map((testimonial, index) => (
                  <TestimonialCard
                    key={index}
                    {...testimonial}
                    delay={index * 150}
                  />
                ))}
              </div>

              {/* Trust Indicators */}
              <div className="text-center animate-fade-in-up">
                <p className="text-gray-400 font-body mb-8">Trusted by students from top universities worldwide</p>
                <div className="flex items-center justify-center space-x-8 opacity-60">
                  <div className="text-xl font-bold text-gray-500">MIT</div>
                  <div className="text-xl font-bold text-gray-500">Harvard</div>
                  <div className="text-xl font-bold text-gray-500">Stanford</div>
                  <div className="text-xl font-bold text-gray-500">Oxford</div>
                  <div className="text-xl font-bold text-gray-500">Cambridge</div>
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced CTA Section */}
          <section className="py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 via-purple-900/20 to-pink-900/30"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.2),transparent_70%)]"></div>
            
            <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
              <div className="animate-fade-in-up">
                <Card className="glass max-w-5xl mx-auto border-2 border-primary-500/30 shadow-2xl">
                  <Card.Body className="text-center space-y-12 p-16">
                    <div className="flex items-center justify-center space-x-4 mb-8">
                      <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl shadow-2xl floating">
                        <HeartIcon className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-4xl md:text-5xl font-display font-bold gradient-text">
                        Ready to Transform Your Learning?
                      </h2>
                    </div>
                    
                    <p className="text-lg md:text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed font-body">
                      Join our community of passionate learners and discover how collaborative studying
                      can accelerate your academic success and create lasting connections.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8 pt-8">
                      <Button
                        onClick={handleDiscover}
                        size="lg"
                        icon={RocketLaunchIcon}
                        className="shadow-glow hover:shadow-glow-lg text-lg px-8 py-4 bg-gradient-to-r from-primary-600 via-primary-500 to-purple-600 hover:from-primary-500 hover:via-primary-400 hover:to-purple-500"
                      >
                        Start Free Today
                      </Button>

                      {currentUser && (
                        <Button
                          variant="secondary"
                          size="lg"
                          onClick={() => navigate('/matches')}
                          icon={ChatBubbleLeftRightIcon}
                          className="shadow-medium text-lg px-8 py-4 bg-gray-800/80 backdrop-blur-sm border-2 border-primary-500/30 hover:border-primary-500/60"
                        >
                          View Messages
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center justify-center space-x-6 text-sm text-gray-400 font-body pt-8">
                      <div className="flex items-center space-x-2">
                        <CheckIcon className="h-5 w-5 text-green-400" />
                        <span>Free to join</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckIcon className="h-5 w-5 text-green-400" />
                        <span>No credit card required</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckIcon className="h-5 w-5 text-green-400" />
                        <span>Cancel anytime</span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <ContactSection />

          {/* Enhanced Footer */}
          <footer className="bg-gray-900/95 backdrop-blur-xl border-t border-primary-600/30 py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900/10 via-transparent to-purple-900/10"></div>
            
            <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
              <div className="text-center space-y-8">
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl shadow-lg">
                    <BookOpenIcon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-3xl font-display font-bold gradient-text">StudyBuddy</span>
                </div>
                
                <p className="text-xl text-gray-300 font-body max-w-2xl mx-auto">
                  Empowering students through collaborative learning and meaningful connections since 2024
                </p>
                
                <div className="flex items-center justify-center space-x-8 text-gray-400">
                  <a href="#" className="hover:text-primary-400 transition-colors duration-300">Privacy Policy</a>
                  <a href="#" className="hover:text-primary-400 transition-colors duration-300">Terms of Service</a>
                  <a href="#" className="hover:text-primary-400 transition-colors duration-300">Support</a>
                </div>
                
                <p className="text-gray-500 font-body">
                  Made with <HeartIcon className="h-5 w-5 text-red-500 inline mx-1" /> for students, by students
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </Layout>
  );
}
