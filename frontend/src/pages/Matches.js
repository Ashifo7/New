import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { io } from 'socket.io-client'; // ADDED: Ensure io is imported here
import {
  PaperAirplaneIcon,
  ArrowLeftIcon,
  EllipsisVerticalIcon,
  FaceSmileIcon,
  PaperClipIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  PhoneIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
import {
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightSolidIcon,
  BookOpenIcon as BookOpenSolidIcon,
  StarIcon as StarSolidIcon
} from '@heroicons/react/24/solid';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// --- Utility Functions ---

// AES key generation
async function generateAESKey() {
  return window.crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

// AES encryption
async function encryptWithAESKey(key, plainText) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plainText);
  const cipher = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  );
  return { cipher: btoa(String.fromCharCode(...new Uint8Array(cipher))), iv: btoa(String.fromCharCode(...iv)) };
}

// AES decryption
async function decryptWithAESKey(key, cipherB64, ivB64) {
  const cipher = Uint8Array.from(atob(cipherB64), c => c.charCodeAt(0));
  const iv = Uint8Array.from(atob(ivB64), c => c.charCodeAt(0));
  const plain = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    cipher
  );
  return new TextDecoder().decode(plain);
}

// RSA encryption (JWK public key)
async function encryptAESKeyWithRSA(jwkPub, aesKey) {
  const pubKey = await window.crypto.subtle.importKey(
    'jwk',
    JSON.parse(jwkPub),
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    true,
    ['encrypt']
  );
  const rawAES = await window.crypto.subtle.exportKey('raw', aesKey);
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    pubKey,
    rawAES
  );
  return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}

// RSA decryption (JWK private key)
async function decryptAESKeyWithRSA(jwkPriv, encryptedB64) {
  const privKey = await window.crypto.subtle.importKey(
    'jwk',
    JSON.parse(jwkPriv),
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    true,
    ['decrypt']
  );
  const encrypted = Uint8Array.from(atob(encryptedB64), c => c.charCodeAt(0));
  const rawAES = await window.crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    privKey,
    encrypted
  );
  return await window.crypto.subtle.importKey(
    'raw',
    rawAES,
    { name: 'AES-GCM' },
    true,
    ['encrypt', 'decrypt']
  );
}

// IndexedDB helpers for private key
const DB_NAME = 'studybuddy-e2ee';
const STORE_NAME = 'keys';
function openDB() {
  return new Promise((resolve, reject) => {
    const req = window.indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE_NAME);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function getPrivateKeyJwk() {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get('privateKey');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  });
}

// Format timestamp
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffInHours < 168) { // 7 days
    return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

// Message Component
const MessageBubble = ({ message, isOwn, user }) => {
  const [showTime, setShowTime] = useState(false);

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4 group`}>
      <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {!isOwn && (
          <Avatar
            src={user?.profilePic}
            name={user?.name}
            size="sm"
            className="flex-shrink-0"
          />
        )}

        <div className="flex flex-col">
          <div
            className={`px-4 py-3 rounded-2xl shadow-soft transition-all duration-300 cursor-pointer hover:shadow-medium ${
              isOwn
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-br-md'
                : 'bg-white text-secondary-900 border border-secondary-200 rounded-bl-md'
            }`}
            onClick={() => setShowTime(!showTime)}
          >
            <p className="text-sm leading-relaxed break-words">{message.content}</p>
          </div>

          {showTime && (
            <div className={`text-xs text-secondary-500 mt-1 px-2 animate-fade-in ${isOwn ? 'text-right' : 'text-left'}`}>
              {formatTime(message.timestamp)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Chat Header Component
const ChatHeader = ({ match, onBack, onMenuClick }) => (
  <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-800 to-gray-700 border-b border-primary-600/30 shadow-large">
    <div className="flex items-center space-x-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        icon={ArrowLeftIcon}
        className="lg:hidden text-gray-300 hover:text-white"
      />

      <Avatar
        src={match.user.profilePic}
        name={match.user.name}
        size="md"
        status={match.user.isOnline ? "online" : "offline"}
        ring
      />

      <div>
        <h3 className="font-semibold text-gray-100 font-display">{match.user.name}</h3>
        <p className={`text-sm flex items-center space-x-1 font-body ${
          match.user.isOnline ? 'text-success-400' : 'text-gray-400'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            match.user.isOnline ? 'bg-success-500 animate-pulse' : 'bg-gray-500'
          }`}></div>
          <span>{match.user.isOnline ? 'Online' : 'Last seen recently'}</span>
        </p>
      </div>
    </div>

    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        icon={PhoneIcon}
        className="text-gray-400 hover:text-white"
      />
      <Button
        variant="ghost"
        size="sm"
        icon={VideoCameraIcon}
        className="text-gray-400 hover:text-white"
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={onMenuClick}
        icon={EllipsisVerticalIcon}
        className="text-gray-400 hover:text-white"
      />
    </div>
  </div>
);

// Message Input Component
const MessageInput = ({ value, onChange, onSend, disabled, placeholder }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className={`p-6 bg-gray-800 border-t border-primary-600/30 transition-all duration-300 ${isFocused ? 'shadow-large' : 'shadow-soft'}`}>
      <div className="flex items-end space-x-3">
        <div className="flex-1 relative">
          <textarea
            value={value}
            onChange={onChange}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="w-full px-4 py-3 pr-12 bg-gray-700 border border-gray-600 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-gray-600 transition-all duration-300 placeholder-gray-400 text-gray-100"
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />

          <div className="absolute right-3 bottom-3 flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="p-1 text-gray-400 hover:text-gray-200"
              icon={FaceSmileIcon}
            />
            <Button
              variant="ghost"
              size="sm"
              className="p-1 text-gray-400 hover:text-gray-200"
              icon={PaperClipIcon}
            />
          </div>
        </div>

        <Button
          onClick={onSend}
          disabled={disabled || !value.trim()}
          variant="primary"
          size="md"
          icon={PaperAirplaneIcon}
          className="rounded-2xl shadow-medium hover:shadow-large"
        />
      </div>
    </div>
  );
};

// Match List Item Component
const MatchListItem = ({ match, isActive, onClick, lastMessage, unreadCount = 0 }) => (
  <div
    onClick={onClick}
    className={`p-4 cursor-pointer transition-all duration-300 border-b border-gray-700 hover:bg-gray-700/50 ${
      isActive ? 'bg-primary-600/20 border-r-4 border-r-primary-500' : ''
    }`}
  >
    <div className="flex items-center space-x-3">
      <div className="relative">
        <Avatar
          src={match.user.profilePic}
          name={match.user.name}
          size="lg"
          status={match.user.isOnline ? "online" : "offline"}
          ring
        />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center shadow-medium">
            <span className="text-xs text-white font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-semibold text-gray-100 truncate font-display">{match.user.name}</h4>
          <span className="text-xs text-gray-400 flex-shrink-0 font-body">
            {formatTime(match.lastMessageAt || match.createdAt)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-300 truncate font-body">
            {lastMessage || "Start your conversation..."}
          </p>
          {unreadCount > 0 && (
            <Badge variant="primary" size="xs" className="ml-2">
              New
            </Badge>
          )}
        </div>

        {/* Study subjects preview */}
        {match.user.subjectsInterested && (
          <div className="flex items-center space-x-1 mt-2">
            {match.user.subjectsInterested.slice(0, 2).map(subject => (
              <Badge key={subject} variant="outline" size="xs">
                {subject}
              </Badge>
            ))}
            {match.user.subjectsInterested.length > 2 && (
              <Badge variant="outline" size="xs">
                +{match.user.subjectsInterested.length - 2}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);

// Empty State Component
const EmptyState = ({ type, title, description, action }) => (
  <div className="flex flex-col items-center justify-center h-full py-16 px-8 text-center">
    <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center mb-6">
      {type === 'matches' ? (
        <UserGroupIcon className="h-12 w-12 text-gray-300" />
      ) : (
        <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-300" />
      )}
    </div>

    <h3 className="text-xl font-bold text-gray-100 mb-2 font-display">{title}</h3>
    <p className="text-gray-300 max-w-md mb-6 text-balance font-body">{description}</p>

    {action && action}
  </div>
);

// Loading Component
const LoadingSpinner = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-full py-16">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
    <p className="text-gray-300 font-body">{message}</p>
  </div>
);

// --- Main Matches Component ---
export default function Matches() {
  const navigate = useNavigate(); // Initialize useNavigate hook here
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [receiverPublicKey, setReceiverPublicKey] = useState(null);
  const [privateKeyJwk, setPrivateKeyJwk] = useState(null);
  const [chatThreads, setChatThreads] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all'); // all, online, offline
  const selectedMatchRef = useRef(null);
  const socketRef = useRef(null);
  const userIdRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    selectedMatchRef.current = selectedMatch;
  }, [selectedMatch]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Connect to socket.io
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // If token is missing, redirect to login
      navigate('/login');
      return;
    }

    const socket = io(SOCKET_URL, { auth: { token } });
    socketRef.current = socket;

    // Emit user_online after connecting
    socket.on('connect', () => {
      const myId = userIdRef.current;
      if (myId) {
        console.log('Emitting user_online:', myId);
        socket.emit('user_online', myId);
      }
    });

    socket.on('receive_e2e_message', async (msg) => {
      const myId = userIdRef.current;
      let encryptedAES = null;
      if (String(msg.receiverId) === String(myId)) encryptedAES = msg.aesKeyForReceiver;
      else if (String(msg.senderId) === String(myId)) encryptedAES = msg.aesKeyForSender;
      const privJwk = privateKeyJwk || await getPrivateKeyJwk();
      if (!encryptedAES || !privJwk) return;
      try {
        const aesKey = await decryptAESKeyWithRSA(privJwk, encryptedAES);
        const text = await decryptWithAESKey(aesKey, msg.encryptedMessage, msg.iv);
        const finalMsg = { ...msg, content: text };
        // Update all threads
        setChatThreads(prev => {
          const current = prev[msg.matchId] || [];
          return { ...prev, [msg.matchId]: [...current, finalMsg] };
        });
        // If current match is open, also update UI
        if (selectedMatchRef.current && selectedMatchRef.current._id === msg.matchId) {
          console.log('Appending to chatMessages for open chat:', msg.matchId, finalMsg);
          setChatMessages(prev => [...prev, finalMsg]);
        } else {
          console.log('Message received for another chat:', msg.matchId, finalMsg);
        }
      } catch (err) {
        console.error('Decryption failed:', err);
      }
    });
    return () => socket.disconnect();
  }, [privateKeyJwk, navigate]);

  useEffect(() => {
    const socket = socketRef.current;
    const myId = userIdRef.current;
    if (socket && socket.connected && myId) {
      console.log('Emitting user_online (effect):', myId);
      socket.emit('user_online', myId);
    }
  }, [privateKeyJwk, matches]);

  // Fetch matches and user info
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // This is handled by the socket useEffect as well, but good to have here too
      navigate('/login');
      return;
    }
    setLoading(true);

    Promise.all([
      fetch(`${API_URL}/api/messages/matches`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${API_URL}/api/users`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${API_URL}/api/users/me`, { headers: { Authorization: `Bearer ${token}` } })
    ])
      .then(([matchesRes, usersRes, currentUserRes]) =>
        Promise.all([matchesRes.json(), usersRes.json(), currentUserRes.json()])
      )
      .then(([matchesData, usersData, currentUserData]) => {
        if (currentUserData.success) {
          setCurrentUser(currentUserData.user);
          const userId = currentUserData.user._id;
          userIdRef.current = userId;
        }

        if (matchesData.success && Array.isArray(matchesData.matches)) {
          let usersById = {};
          if (usersData.success && Array.isArray(usersData.users)) {
            usersData.users.forEach(u => { usersById[u._id] = u; });
          }

          const matchesWithUser = matchesData.matches.map(m => {
            const userId = userIdRef.current;
            const otherId = m.userA === userId ? m.userB : m.userA;
            return { ...m, user: usersById[otherId] };
          }).filter(m => m.user);

          setMatches(matchesWithUser);
        } else {
          setError(matchesData.error || 'Could not fetch matches');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Could not fetch matches');
        setLoading(false);
      });

    getPrivateKeyJwk().then(setPrivateKeyJwk);
  }, [navigate]);

  // Filter matches based on search and filters
  const filteredMatches = matches.filter(match => {
    const matchesSearch = match.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'online' && match.user.isOnline) ||
      (filterStatus === 'offline' && !match.user.isOnline);

    return matchesSearch && matchesStatus;
  });

  // Open chat function
  const openChat = async (match) => {
    setSelectedMatch(match);
    setChatInput('');
    setError('');

    if (chatThreads[match._id]) {
      setChatMessages(chatThreads[match._id]);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) { // Added token check before API call
      navigate('/login');
      return;
    }

    try {
      // Fetch E2EE messages
      const msgsRes = await fetch(`${API_URL}/api/e2e/messages/${match._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const msgsData = await msgsRes.json();

      if (!msgsData.success) {
        setError('Could not fetch messages');
        return;
      }

      // Fetch receiver's public key
      const otherUserId = match.user._id;
      const userRes = await fetch(`${API_URL}/api/users/${otherUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = await userRes.json();

      if (userData.success && userData.user && userData.user.publicKey) {
        setReceiverPublicKey(userData.user.publicKey);
      } else {
        setError('Recipient has no public key');
        return;
      }

      // Decrypt all messages
      const privJwk = privateKeyJwk || await getPrivateKeyJwk();
      const myId = userIdRef.current;
      const decryptedMsgs = await Promise.all(
        (msgsData.messages || []).map(async (msg) => {
          let encryptedAES = null;
          if (String(msg.receiverId) === String(myId)) encryptedAES = msg.aesKeyForReceiver;
          else if (String(msg.senderId) === String(myId)) encryptedAES = msg.aesKeyForSender;
          if (!encryptedAES) return { ...msg, content: '[Cannot decrypt]' };
          try {
            const aesKey = await decryptAESKeyWithRSA(privJwk, encryptedAES);
            const text = await decryptWithAESKey(aesKey, msg.encryptedMessage, msg.iv);
            return { ...msg, content: text };
          } catch {
            return { ...msg, content: '[Cannot decrypt]' };
          }
        })
      );

      setChatMessages(decryptedMsgs);
      setChatThreads(prev => ({ ...prev, [match._id]: decryptedMsgs }));
    } catch (err) {
      setError('Failed to load chat');
    }
  };

  // Send message function
  const sendMessage = async () => {
    if (!chatInput.trim() || !selectedMatch || !receiverPublicKey || sendingMessage) return;

    setSendingMessage(true);
    const privJwk = privateKeyJwk || await getPrivateKeyJwk();
    const token = localStorage.getItem('token');
    if (!token) { // Added token check before API call
      navigate('/login');
      return;
    }

    try {
      // Fetch sender's public key
      const myId = userIdRef.current;
      const myUserRes = await fetch(`${API_URL}/api/users/${myId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const myUserData = await myUserRes.json();

      if (!myUserData.success || !myUserData.user || !myUserData.user.publicKey) {
        setError('Your public key is missing');
        return;
      }

      // Generate AES key and encrypt message
      const aesKey = await generateAESKey();
      const { cipher, iv } = await encryptWithAESKey(aesKey, chatInput);

      // Encrypt AES key for both users
      const aesKeyForSender = await encryptAESKeyWithRSA(myUserData.user.publicKey, aesKey);
      const aesKeyForReceiver = await encryptAESKeyWithRSA(receiverPublicKey, aesKey);

      // Emit via socket.io
      const payload = {
        matchId: selectedMatch._id,
        senderId: myId,
        receiverId: selectedMatch.user._id,
        encryptedMessage: cipher,
        aesKeyForSender,
        aesKeyForReceiver,
        iv
      };

      socketRef.current.emit('send_e2e_message', payload);

      // Optimistically add to chat
      const optimisticMessage = {
        senderId: myId,
        receiverId: selectedMatch.user._id,
        content: chatInput,
        timestamp: new Date().toISOString()
      };

      setChatMessages(prev => [...prev, optimisticMessage]);
      setChatInput('');
    } catch (err) {
      setError('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <Layout user={currentUser}>
        <div className="bg-gray-900 grid-bg min-h-screen">
          <LoadingSpinner message="Loading your conversations..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={currentUser}>
      <div className="max-w-7xl mx-auto h-[calc(100vh-12rem)]">
        {/* Header */}
        <div className="mb-6 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text font-display">Messages</h1>
              <p className="text-gray-300 mt-1 font-body">Connect with your study partners</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="primary" size="sm">
                {matches.filter(m => m.unreadCount > 0).length} New
              </Badge>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/home')}
                icon={UserGroupIcon}
              >
                Find Partners
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 h-full bg-gray-800 rounded-2xl shadow-large overflow-hidden border border-primary-600/20">
          {/* Matches List */}
          <div className={`lg:col-span-1 border-r border-secondary-200 grid-bg-subtle ${selectedMatch ? 'hidden lg:block' : 'block'}`}>
            <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-100 flex items-center space-x-2 font-display">
                    <ChatBubbleLeftRightSolidIcon className="h-6 w-6 text-primary-600" />
                    <span>Messages</span>
                  </h2>
                  <p className="text-sm text-gray-300 mt-1 font-body">
                    {filteredMatches.length} of {matches.length} conversation{matches.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  icon={FunnelIcon}
                  className="text-gray-400 hover:text-gray-200"
                />
              </div>

              {/* Search and Filters */}
              <div className="mt-4 space-y-3">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 text-sm font-body"
                  />
                </div>

                {showFilters && (
                  <div className="flex items-center space-x-2 animate-slide-down">
                    {['all', 'online', 'offline'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 capitalize font-body ${
                          filterStatus === status
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="overflow-y-auto h-full">
              {filteredMatches.length === 0 ? (
                <EmptyState
                  type="matches"
                  title={matches.length === 0 ? "No conversations yet" : "No matches found"}
                  description={matches.length === 0
                    ? "Start matching with study partners to begin conversations and collaborate on your learning journey."
                    : "Try adjusting your search or filters to find conversations."
                  }
                  action={
                    matches.length === 0 && (
                      <Button
                        variant="primary"
                        onClick={() => navigate('/home')}
                        icon={BookOpenSolidIcon}
                        className="shadow-medium"
                      >
                        Find Study Partners
                      </Button>
                    )
                  }
                />
              ) : (
                filteredMatches.map(match => (
                  <MatchListItem
                    key={match._id}
                    match={match}
                    isActive={selectedMatch?._id === match._id}
                    onClick={() => openChat(match)}
                    lastMessage="Hey! Ready to study together?"
                    unreadCount={Math.floor(Math.random() * 3)} // Mock unread count
                  />
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`lg:col-span-2 flex flex-col ${selectedMatch ? 'block' : 'hidden lg:flex'}`}>
            {selectedMatch ? (
              <>
                <ChatHeader
                  match={selectedMatch}
                  onBack={() => setSelectedMatch(null)}
                  onMenuClick={() => {}}
                />

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-900/30 to-gray-800 grid-bg-subtle">
                  {error && (
                    <div className="mb-4 p-4 bg-danger-50 border border-danger-200 rounded-xl flex items-center space-x-3 animate-fade-in">
                      <ExclamationTriangleIcon className="h-5 w-5 text-danger-600 flex-shrink-0" />
                      <p className="text-sm text-danger-800">{error}</p>
                    </div>
                  )}

                  {/* Welcome Message */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-100 to-primary-200 rounded-full mb-4">
                      <BookOpenSolidIcon className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-100 mb-2 font-display">
                      You matched with {selectedMatch.user.name}!
                    </h3>
                    <p className="text-sm text-gray-300 max-w-md mx-auto font-body">
                      Start your study journey together. Share your goals, schedule study sessions, and help each other succeed.
                    </p>
                  </div>

                  {/* Messages */}
                  {chatMessages.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400 text-sm font-body">No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    chatMessages.map((message, index) => (
                      <MessageBubble
                        key={message._id || index}
                        message={message}
                        isOwn={message.senderId === userIdRef.current}
                        user={message.senderId === selectedMatch.user._id ? selectedMatch.user : currentUser}
                      />
                    ))
                  )}

                  {sendingMessage && (
                    <div className="flex justify-end mb-4">
                      <div className="flex items-center space-x-2 px-4 py-3 bg-primary-100 rounded-2xl rounded-br-md">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs text-primary-700">Sending...</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                <MessageInput
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onSend={sendMessage}
                  disabled={sendingMessage}
                  placeholder={`Message ${selectedMatch.user.name}...`}
                />
              </>
            ) : (
              <EmptyState
                type="chat"
                title="Select a conversation"
                description="Choose a conversation from the sidebar to start chatting with your study partners."
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}