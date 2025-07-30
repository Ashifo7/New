import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HeartIcon,
  SparklesIcon,
  AcademicCapIcon,
  UserGroupIcon,
  BookOpenIcon,
  ArrowRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Layout from '../components/layout/Layout';
import RotatingText from '../components/RotatingText';
import Particles from '../components/Particles'; // Import the OGL Particles component

// Quote component
const QuoteCard = ({ quote, author, role, delay = 0 }) => (
  <Card
    className={`glass hover:shadow-glow transition-all duration-700 hover:-translate-y-2 animate-fade-in-up`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <Card.Body className="text-center space-y-4" padding="lg">
      <ChatBubbleLeftRightIcon className="h-8 w-8 text-primary-400 mx-auto opacity-60" />
      <blockquote className="text-lg text-gray-200 italic leading-relaxed font-body">
        "{quote}"
      </blockquote>
      <div className="space-y-1">
        <p className="font-semibold text-gray-100 font-display">{author}</p>
        <p className="text-sm text-gray-300 font-body">{role}</p>
      </div>
    </Card.Body>
  </Card>
);

// Feature highlight component
const FeatureHighlight = ({ icon: Icon, title, description, delay = 0 }) => (
  <div
    className={`text-center space-y-6 animate-fade-in-up`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl shadow-large mx-auto floating">
      <Icon className="h-10 w-10 text-white" />
    </div>
    <h3 className="text-2xl font-bold text-gray-100 font-display">{title}</h3>
    <p className="text-gray-300 leading-relaxed text-lg font-body max-w-sm mx-auto">{description}</p>
  </div>
);

// Contact section component
const ContactSection = () => (
  <section id="contact" className="py-24 bg-gray-800/50">
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
      <div className="text-center mb-16 animate-fade-in-up">
        <h2 className="text-4xl font-display font-bold text-gray-100 mb-6">
          Get in Touch
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto font-body leading-relaxed">
          Have questions about StudyBuddy? We'd love to hear from you. Reach out to us and we'll get back to you as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-8 animate-fade-in-up">
          <div className="space-y-6">
            <h3 className="text-2xl font-display font-bold text-gray-100 mb-8">
              Contact Information
            </h3>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary-600/20 rounded-xl">
                  <EnvelopeIcon className="h-6 w-6 text-primary-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-100 font-display">Email</h4>
                  <p className="text-gray-300 font-body">support@studybuddy.com</p>
                  <p className="text-sm text-gray-400 font-body">We'll respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary-600/20 rounded-xl">
                  <PhoneIcon className="h-6 w-6 text-primary-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-100 font-display">Phone</h4>
                  <p className="text-gray-300 font-body">+1 (555) 123-4567</p>
                  <p className="text-sm text-gray-400 font-body">Mon-Fri, 9AM-6PM EST</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary-600/20 rounded-xl">
                  <MapPinIcon className="h-6 w-6 text-primary-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-100 font-display">Office</h4>
                  <p className="text-gray-300 font-body">123 Education Street</p>
                  <p className="text-gray-300 font-body">Learning City, LC 12345</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary-600/10 to-primary-700/10 rounded-2xl p-8 border border-primary-600/20">
            <h4 className="text-xl font-display font-bold text-gray-100 mb-4">
              Quick Support
            </h4>
            <p className="text-gray-300 font-body mb-6">
              Need immediate help? Check out our FAQ section or join our community Discord for real-time support from other students.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="secondary" size="sm" className="flex-1">
                View FAQ
              </Button>
              <Button variant="secondary" size="sm" className="flex-1">
                Join Discord
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <Card className="animate-fade-in-up shadow-large">
          <Card.Body padding="lg">
            <h3 className="text-2xl font-display font-bold text-gray-100 mb-8">
              Send us a Message
            </h3>

            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-200 font-display">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 font-body"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-200 font-display">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 font-body"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-200 font-display">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 font-body"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-200 font-display">
                  Subject
                </label>
                <select className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 font-body">
                  <option value="">Select a topic</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-200 font-display">
                  Message
                </label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 resize-none font-body"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <Button
                type="submit"
                fullWidth
                size="lg"
                icon={EnvelopeIcon}
                className="shadow-glow hover:shadow-glow-lg"
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

const quotes = [
  {
    quote: "StudyBuddy transformed my learning experience. Finding study partners who share my passion for computer science has made studying so much more engaging and effective.",
    author: "Sarah Chen",
    role: "Computer Science Student"
  },
  {
    quote: "The collaborative environment StudyBuddy creates is incredible. I've not only improved my grades but also made lifelong friendships through shared learning goals.",
    author: "Marcus Johnson",
    role: "Medical Student"
  },
  {
    quote: "As someone who struggled with motivation, StudyBuddy's matching system helped me find accountability partners who keep me on track with my studies.",
    author: "Priya Patel",
    role: "Engineering Student"
  },
  {
    quote: "The secure messaging and study session planning features make it so easy to coordinate with my study group. StudyBuddy is a game-changer for collaborative learning.",
    author: "Alex Rodriguez",
    role: "Business Student"
  },
  {
    quote: "I love how StudyBuddy matches me with people who complement my learning style. Together, we've tackled complex subjects that seemed impossible alone.",
    author: "Emma Thompson",
    role: "Psychology Student"
  },
  {
    quote: "StudyBuddy's community feels like having a personal learning network. The support and knowledge sharing here is unmatched.",
    author: "David Kim",
    role: "Data Science Student"
  }
];

export default function Landing() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayedQuotes, setDisplayedQuotes] = useState([]);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch current user
    fetch('/api/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCurrentUser(data.user);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [navigate]);

  useEffect(() => {
    // Randomly select 3 quotes to display
    const shuffled = [...quotes].sort(() => 0.5 - Math.random());
    setDisplayedQuotes(shuffled.slice(0, 3));
  }, []);

  // Define scrollToSection here so it can be passed down
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'contact'];
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-300 font-body">Loading your experience...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout user={currentUser}>
      <div className="min-h-screen bg-gray-900 relative overflow-hidden">
        {/* Particles Background Container */}
        {/* This div positions the Particles component to fill the entire viewport */}
        <div className="fixed inset-0 z-0">
          <Particles
            particleColors={['#ffffff', '#ffffff']} // White particles
            particleCount={200}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={100}
            moveParticlesOnHover={true}
            particleHoverFactor={1}
            alphaParticles={false}
            disableRotation={false}
          />
        </div>

        {/* Main Content Container */}
        <div className="relative z-10 bg-gray-900/90">
          {/* Hero Section */}
          <section id="home" className="py-24 lg:py-32">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
              <div className="text-center space-y-12 mb-24 animate-fade-in-up">
                <div className="space-y-8">
                  <div className="flex items-center justify-center space-x-6 mb-12">
                    <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl shadow-large floating">
                      <BookOpenIcon className="h-12 w-12 text-white" />
                    </div>
                    <h1 className="text-6xl font-display font-bold text-gray-100 text-balance flex items-center justify-center space-x-3">
                      <span>Find Your Perfect</span>
                      <RotatingText
                        texts={['Study Partner', 'Mentor', 'Collaborator', 'Buddy']}
                        mainClassName="text-primary-300 inline-flex items-center justify-center"
                        staggerFrom={"last"}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-120%" }}
                        staggerDuration={0.025}
                        splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                        transition={{ type: "spring", damping: 30, stiffness: 400 }}
                        rotationInterval={2000}
                      />
                    </h1>
                  </div>

                  <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-body">
                    Join thousands of students who have transformed their learning experience through
                    meaningful connections, collaborative study sessions, and shared academic goals.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8">
                  <Button
                    onClick={handleDiscover}
                    size="xl"
                    icon={SparklesIcon}
                    className="shadow-glow hover:shadow-glow-lg text-lg px-12 py-6"
                  >
                    Discover
                  </Button>
                  <Button
                    variant="secondary"
                    size="xl"
                    onClick={() => scrollToSection('about')}
                    icon={InformationCircleIcon}
                    className="shadow-medium text-lg px-12 py-6"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* About/Features Section */}
          <section id="about" className="py-24 bg-gray-800/30">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
              <div className="text-center mb-20 animate-fade-in-up">
                <h2 className="text-5xl font-display font-bold text-gray-100 mb-8">
                  Why Students Love StudyBuddy
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto font-body leading-relaxed">
                  Discover the features that make collaborative learning effective and enjoyable
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-24">
                <FeatureHighlight
                  icon={UserGroupIcon}
                  title="Smart Matching"
                  description="Our intelligent algorithm connects you with study partners who share your subjects, schedule, and learning goals."
                  delay={100}
                />
                <FeatureHighlight
                  icon={BookOpenIcon}
                  title="Collaborative Learning"
                  description="Study together, share resources, and tackle challenging subjects with peers who motivate and support you."
                  delay={200}
                />
                <FeatureHighlight
                  icon={AcademicCapIcon}
                  title="Academic Success"
                  description="Track your progress, celebrate achievements, and reach your academic goals faster with dedicated study partners."
                  delay={300}
                />
              </div>

              {/* Quotes Section */}
              <div className="mb-20">
                <div className="text-center mb-16 animate-fade-in-up">
                  <h2 className="text-4xl font-display font-bold text-gray-100 mb-6">
                    What Our Students Say
                  </h2>
                  <p className="text-xl text-gray-300 max-w-3xl mx-auto font-body leading-relaxed">
                    Real experiences from students who found their perfect study partners
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {displayedQuotes.map((quote, index) => (
                    <QuoteCard
                      key={index}
                      quote={quote.quote}
                      author={quote.author}
                      role={quote.role}
                      delay={index * 150}
                    />
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center space-y-8 animate-fade-in-up">
                <Card className="glass max-w-5xl mx-auto">
                  <Card.Body className="text-center space-y-8" padding="lg">
                    <div className="flex items-center justify-center space-x-4 mb-8">
                      <SparklesIcon className="h-10 w-10 text-primary-400" />
                      <h2 className="text-4xl font-display font-bold gradient-text">Ready to Transform Your Learning?</h2>
                    </div>
                    <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-body">
                      Join our community of passionate learners and discover how collaborative studying
                      can accelerate your academic success and create lasting connections.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8 pt-8">
                      <Button
                        onClick={handleDiscover}
                        size="xl"
                        icon={ArrowRightIcon}
                        className="shadow-glow hover:shadow-glow-lg text-lg px-12 py-6"
                      >
                        Discover Now
                      </Button>

                      {currentUser && (
                        <Button
                          variant="secondary"
                          size="xl"
                          onClick={() => navigate('/matches')}
                          icon={UserGroupIcon}
                          className="shadow-medium text-lg px-12 py-6"
                        >
                          View Messages
                        </Button>
                      )}
                    </div>

                    <div className="text-sm text-gray-400 flex items-center justify-center space-x-2 font-body mt-6">
                      <HeartSolidIcon className="h-5 w-5 text-primary-500" />
                      <span>Join 10,000+ students already studying together</span>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <ContactSection />

          {/* Footer */}
          <footer className="bg-gray-900/80 backdrop-blur-xl border-t border-primary-600/30 py-16">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl">
                    <HeartIcon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-2xl font-display font-bold gradient-text">StudyBuddy</span>
                </div>
                <p className="text-lg text-gray-300 font-body">
                  Empowering students through collaborative learning since 2024
                </p>
                <p className="text-sm text-gray-400 font-body">
                  Made with ❤️ for students, by students
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </Layout>
  );
}
