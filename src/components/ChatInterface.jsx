import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Bot, User, Sparkles, Zap, ArrowLeft, MoreVertical, Minimize2, Maximize2, Mic, MicOff, Menu, Search, MessageSquare, Clock, X, Trash2, Globe, BookOpen, CheckCircle } from 'lucide-react';

export default function ChatInterface() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      intent: 'greeting'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState(null);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isSpellChecking, setIsSpellChecking] = useState(false);
  const [spellCheckSuggestions, setSpellCheckSuggestions] = useState([]);
  const [showSearchOptions, setShowSearchOptions] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const recognitionRef = useRef(null);
  const searchOptionsRef = useRef(null);

  // LocalStorage helpers
  const saveToLocalStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const loadFromLocalStorage = (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        // Convert timestamp strings back to Date objects
        if (key === 'chatHistory' && Array.isArray(parsed)) {
          return parsed.map(chat => ({
            ...chat,
            timestamp: new Date(chat.timestamp)
          }));
        }
        if (key === 'currentMessages' && Array.isArray(parsed)) {
          return parsed.map(message => ({
            ...message,
            timestamp: new Date(message.timestamp)
          }));
        }
        return parsed;
      }
      return defaultValue;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return defaultValue;
    }
  };

  // Load chat history and current chat from localStorage on component mount
  useEffect(() => {
    const savedChatHistory = loadFromLocalStorage('chatHistory', []);
    const savedCurrentChatId = loadFromLocalStorage('currentChatId', null);
    const savedMessages = loadFromLocalStorage('currentMessages', []);

    if (savedChatHistory.length > 0) {
      setChatHistory(savedChatHistory);
    } else {
      // Initialize with default chat if no saved history
      const defaultChat = {
        id: Date.now(),
        title: "Getting Started with AI",
        lastMessage: "Hello! I'm your AI assistant. How can I help you today?",
        timestamp: new Date(),
        messageCount: 1,
        messages: [
          {
            id: 1,
            text: "Hello! I'm your AI assistant. How can I help you today?",
            sender: 'bot',
            timestamp: new Date(),
            intent: 'greeting'
          }
        ]
      };
      setChatHistory([defaultChat]);
      setCurrentChatId(defaultChat.id);
      setMessages(defaultChat.messages);
      saveToLocalStorage('chatHistory', [defaultChat]);
      saveToLocalStorage('currentChatId', defaultChat.id);
      saveToLocalStorage('currentMessages', defaultChat.messages);
    }

    if (savedCurrentChatId && savedMessages.length > 0) {
      setCurrentChatId(savedCurrentChatId);
      setMessages(savedMessages);
    } else if (savedChatHistory.length > 0) {
      // Load the most recent chat
      const mostRecentChat = savedChatHistory[0];
      setCurrentChatId(mostRecentChat.id);
      setMessages(mostRecentChat.messages || [
        {
          id: 1,
          text: "Hello! I'm your AI assistant. How can I help you today?",
          sender: 'bot',
          timestamp: new Date(),
          intent: 'greeting'
        }
      ]);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (currentChatId && messages.length > 0) {
      saveToLocalStorage('currentMessages', messages);
      saveToLocalStorage('currentChatId', currentChatId);

      // Update the chat history with new messages
      setChatHistory(prev => {
        const updatedHistory = prev.map(chat => {
          if (chat.id === currentChatId) {
            const lastMessage = messages[messages.length - 1];
            return {
              ...chat,
              messages: messages,
              lastMessage: lastMessage.text,
              messageCount: messages.length,
              timestamp: lastMessage.timestamp
            };
          }
          return chat;
        });
        saveToLocalStorage('chatHistory', updatedHistory);
        return updatedHistory;
      });
    }
  }, [messages, currentChatId]);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (chatHistory.length > 0) {
      saveToLocalStorage('chatHistory', chatHistory);
    }
  }, [chatHistory]);

  // Initialize particles (fewer for chat interface)
  useEffect(() => {
    const initialParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.3 + 0.1,
      color: ['purple', 'blue', 'pink'][Math.floor(Math.random() * 3)]
    }));
    setParticles(initialParticles);
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setInputMessage(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);

        // Show user-friendly error message
        const errorMessage = {
          id: Date.now() + 1,
          text: 'Sorry, I had trouble hearing you. Please try again or type your message.',
          sender: 'bot',
          timestamp: new Date(),
          intent: 'error'
        };
        setMessages(prev => [...prev, errorMessage]);
      };

      recognitionRef.current = recognition;
      setIsVoiceSupported(true);
    } else {
      setIsVoiceSupported(false);
      console.log('Speech Recognition not supported in this browser');
    }
  }, []);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Click outside to close search options
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchOptionsRef.current && !searchOptionsRef.current.contains(event.target)) {
        setShowSearchOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Animate particles
  useEffect(() => {
    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x > window.innerWidth ? 0 : particle.x < 0 ? window.innerWidth : particle.x + particle.speedX,
        y: particle.y > window.innerHeight ? 0 : particle.y < 0 ? window.innerHeight : particle.y + particle.speedY,
      })));
    };

    const interval = setInterval(animateParticles, 100);
    return () => clearInterval(interval);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Spell check function
  const checkSpelling = async (text) => {
    if (!text.trim()) return text;

    setIsSpellChecking(true);
    try {
      const response = await fetch('https://new-folder-2-lime.vercel.app/api/spell-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.corrected_text || text;
      }
    } catch (error) {
      console.error('Spell check error:', error);
    } finally {
      setIsSpellChecking(false);
    }
    return text;
  };

  // Enhanced search function
  const performSearch = async (query, searchType = 'general') => {
    if (!query.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: `🔍 Searching: ${query}`,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      let endpoint = 'https://new-folder-2-lime.vercel.app/api/search';
      let searchLabel = 'Enhanced Search';

      switch (searchType) {
        case 'google':
          endpoint = 'https://new-folder-2-lime.vercel.app/api/search/google';
          searchLabel = 'Google Search';
          break;
        case 'knowledge':
          endpoint = 'https://new-folder-2-lime.vercel.app/api/search/knowledge';
          searchLabel = 'Knowledge Base Search';
          break;
        default:
          endpoint = 'https://new-folder-2-lime.vercel.app/api/search';
          searchLabel = 'Enhanced Search';
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query
        })
      });

      if (response.ok) {
        const data = await response.json();

        setTimeout(() => {
          const searchMessage = {
            id: Date.now() + 1,
            text: data.response || data.results || 'Search completed, but no results found.',
            sender: 'bot',
            timestamp: new Date(),
            intent: 'search_result',
            searchType: searchType
          };

          setMessages(prev => [...prev, searchMessage]);
          setIsLoading(false);
          setIsTyping(false);
        }, 1000);
      } else {
        throw new Error('Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);

      setTimeout(() => {
        const errorMessage = {
          id: Date.now() + 1,
          text: 'Sorry, I encountered an error while searching. Please try again.',
          sender: 'bot',
          timestamp: new Date(),
          intent: 'error'
        };

        setMessages(prev => [...prev, errorMessage]);
        setIsLoading(false);
        setIsTyping(false);
      }, 1000);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // First, check spelling
    const correctedMessage = await checkSpelling(inputMessage);

    // If spelling was corrected, show the corrected version briefly
    if (correctedMessage !== inputMessage) {
      setInputMessage(correctedMessage);

      // Show a brief notification about spell correction
      const correctionNotice = {
        id: Date.now() - 1,
        text: `✓ Spell check applied: "${inputMessage}" → "${correctedMessage}"`,
        sender: 'system',
        timestamp: new Date(),
        intent: 'spell_correction'
      };
      setMessages(prev => [...prev, correctionNotice]);

      // Small delay to show the correction
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const userMessage = {
      id: Date.now(),
      text: correctedMessage,
      sender: 'user',
      timestamp: new Date()
    };

    const currentInput = correctedMessage;
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);
    setShowSearchOptions(false);

    try {
      const response = await fetch('https://new-folder-2-lime.vercel.app/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // Simulate typing delay
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          text: data.response || 'Sorry, I encountered an error. Please try again.',
          sender: 'bot',
          timestamp: new Date(),
          intent: data.intent || 'unknown'
        };

        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
        setIsTyping(false);

        // Update chat title based on first user message
        if (currentChatId) {
          setChatHistory(prevHistory => {
            const updatedHistory = prevHistory.map(chat => {
              if (chat.id === currentChatId && chat.title === "New Conversation") {
                // Generate title from first user message (max 50 chars)
                const newTitle = currentInput.length > 50
                  ? currentInput.substring(0, 47) + "..."
                  : currentInput;
                return { ...chat, title: newTitle };
              }
              return chat;
            });
            return updatedHistory;
          });
        }
      }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
        sender: 'bot',
        timestamp: new Date(),
        intent: 'error'
      };

      setTimeout(() => {
        setMessages(prev => [...prev, errorMessage]);
        setIsLoading(false);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startVoiceInput = () => {
    if (recognitionRef.current && isVoiceSupported && !isListening) {
      setInputMessage(''); // Clear existing text
      recognitionRef.current.start();
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      stopVoiceInput();
    } else {
      startVoiceInput();
    }
  };

  const goBack = () => {
    navigate('/');
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return timestamp.toLocaleDateString();
  };

  const filteredChatHistory = chatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startNewChat = () => {
    const newChatId = Date.now();
    const initialMessage = {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      intent: 'greeting'
    };

    const newChat = {
      id: newChatId,
      title: "New Conversation",
      lastMessage: initialMessage.text,
      timestamp: new Date(),
      messageCount: 1,
      messages: [initialMessage]
    };

    setChatHistory(prev => [newChat, ...prev]);
    setCurrentChatId(newChatId);
    setMessages([initialMessage]);
    setIsSidebarOpen(false);

    // Save to localStorage
    saveToLocalStorage('currentChatId', newChatId);
    saveToLocalStorage('currentMessages', [initialMessage]);
  };

  const loadChat = (chatId) => {
    const selectedChat = chatHistory.find(chat => chat.id === chatId);
    if (selectedChat) {
      setCurrentChatId(chatId);
      const chatMessages = selectedChat.messages || [
        {
          id: 1,
          text: "Hello! I'm your AI assistant. How can I help you today?",
          sender: 'bot',
          timestamp: new Date(),
          intent: 'greeting'
        }
      ];
      setMessages(chatMessages);
      setIsSidebarOpen(false);

      // Save to localStorage
      saveToLocalStorage('currentChatId', chatId);
      saveToLocalStorage('currentMessages', chatMessages);
    }
  };

  const deleteChat = (chatId, e) => {
    e.stopPropagation(); // Prevent triggering loadChat

    setChatHistory(prev => {
      const updatedHistory = prev.filter(chat => chat.id !== chatId);
      saveToLocalStorage('chatHistory', updatedHistory);

      // If deleting current chat, switch to another chat or create new one
      if (chatId === currentChatId) {
        if (updatedHistory.length > 0) {
          const newCurrentChat = updatedHistory[0];
          setCurrentChatId(newCurrentChat.id);
          setMessages(newCurrentChat.messages || []);
          saveToLocalStorage('currentChatId', newCurrentChat.id);
          saveToLocalStorage('currentMessages', newCurrentChat.messages || []);
        } else {
          // No chats left, create a new one
          setTimeout(() => startNewChat(), 100);
        }
      }

      return updatedHistory;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex relative overflow-hidden">

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-black/30 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <MessageSquare size={20} className="mr-2" />
                Chat History
              </h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-1 hover:bg-white/10 rounded-full transition-colors duration-200"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 transition-all duration-300"
              />
            </div>

            {/* New Chat Button */}
            <button
              onClick={startNewChat}
              className="w-full mt-3 p-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 rounded-lg text-white font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <MessageSquare size={16} />
              <span>New Chat</span>
            </button>
          </div>

          {/* Chat History List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredChatHistory.length === 0 ? (
              <div className="text-center text-gray-400 mt-8">
                <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                <p>No conversations found</p>
                {searchQuery && (
                  <p className="text-sm mt-2">Try a different search term</p>
                )}
              </div>
            ) : (
              filteredChatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className={`relative group transition-all duration-300 hover:bg-white/10 rounded-lg ${
                    currentChatId === chat.id ? 'bg-purple-500/20 border border-purple-400/30' : 'bg-black/20 border border-transparent'
                  }`}
                >
                  <button
                    onClick={() => loadChat(chat.id)}
                    className="w-full p-3 text-left transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-white text-sm truncate flex-1 group-hover:text-purple-300 transition-colors duration-200 pr-2">
                        {chat.title}
                      </h3>
                      <div className="flex items-center space-x-1 ml-2">
                        <Clock size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-400">{formatDate(chat.timestamp)}</span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs truncate mb-2">
                      {chat.lastMessage}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {chat.messageCount} messages
                      </span>
                      {currentChatId === chat.id && (
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => deleteChat(chat.id, e)}
                    className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded-full transition-all duration-200 hover:scale-110"
                    title="Delete conversation"
                  >
                    <Trash2 size={14} className="text-red-400 hover:text-red-300" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

      {/* Moving Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute pointer-events-none z-0"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            background: `radial-gradient(circle, ${
              particle.color === 'purple' ? '#a855f7' :
              particle.color === 'blue' ? '#3b82f6' : '#ec4899'
            }, transparent)`,
            borderRadius: '50%',
            filter: 'blur(1px)'
          }}
        />
      ))}

      {/* Mouse Follower */}
      <div
        className="fixed w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 pointer-events-none transition-all duration-150 ease-out z-50"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
        }}
      />

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-20 left-1/3 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Mobile Sidebar Toggle */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110 group"
            >
              <Menu size={24} className="text-white group-hover:text-purple-400 transition-colors duration-300" />
            </button>

            <button
              onClick={goBack}
              className="p-2 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110 group"
            >
              <ArrowLeft size={24} className="text-white group-hover:text-purple-400 transition-colors duration-300" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
                  <Bot size={24} className="text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900 animate-ping"></div>
              </div>

              <div>
                <h1 className="text-xl font-bold text-white">AI Assistant</h1>
                <p className="text-sm text-gray-300 flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                  {isTyping ? 'Typing...' : 'Online'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110"
            >
              {isMinimized ? <Maximize2 size={20} className="text-white" /> : <Minimize2 size={20} className="text-white" />}
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110">
              <MoreVertical size={20} className="text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className={`flex-1 flex flex-col transition-all duration-500 ${isMinimized ? 'h-20 overflow-hidden' : ''}`}>
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl mx-auto w-full"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#6366f1 transparent'
          }}
        >
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex items-end space-x-2 animate-fadeInUp ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
              style={{animationDelay: `${index * 100}ms`}}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                  : message.sender === 'system'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500'
              } shadow-lg animate-pulse`}>
                {message.sender === 'user' ? (
                  <User size={20} className="text-white" />
                ) : message.sender === 'system' ? (
                  <CheckCircle size={20} className="text-white" />
                ) : (
                  <Bot size={20} className="text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                message.sender === 'user' ? 'text-right' : 'text-left'
              }`}>
                <div className={`relative inline-block p-4 rounded-2xl shadow-xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 group ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-500/90 to-cyan-500/90 text-white border-blue-400/50'
                    : message.sender === 'system'
                    ? 'bg-gradient-to-r from-green-500/90 to-emerald-500/90 text-white border-green-400/50'
                    : 'bg-black/40 text-white border-white/20 hover:bg-black/60'
                }`}>

                  {/* Message Text */}
                  <p className="text-sm leading-relaxed">{message.text}</p>

                  {/* Intent Badge (for bot messages) */}
                  {message.sender === 'bot' && message.intent && message.intent !== 'unknown' && (
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full border ${
                        message.intent === 'search_result'
                          ? 'bg-blue-500/30 text-blue-200 border-blue-400/30'
                          : message.intent === 'spell_correction'
                          ? 'bg-green-500/30 text-green-200 border-green-400/30'
                          : message.intent === 'error'
                          ? 'bg-red-500/30 text-red-200 border-red-400/30'
                          : 'bg-purple-500/30 text-purple-200 border-purple-400/30'
                      }`}>
                        {message.intent === 'search_result' ? (
                          <Search size={10} className="mr-1" />
                        ) : message.intent === 'spell_correction' ? (
                          <CheckCircle size={10} className="mr-1" />
                        ) : (
                          <Sparkles size={10} className="mr-1" />
                        )}
                        {message.intent.replace('_', ' ')}
                        {message.searchType && ` (${message.searchType})`}
                      </span>
                    </div>
                  )}

                  {/* System message styling */}
                  {message.sender === 'system' && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 text-xs bg-green-500/30 text-green-200 rounded-full border border-green-400/30">
                        <CheckCircle size={10} className="mr-1" />
                        Auto-corrected
                      </span>
                    </div>
                  )}

                  {/* Message glow effect */}
                  <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                      : message.sender === 'system'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500'
                  }`}></div>
                </div>

                {/* Timestamp */}
                <p className="text-xs text-gray-400 mt-1 px-2">
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-end space-x-2 animate-fadeInUp">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
                <Bot size={20} className="text-white" />
              </div>
              <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="relative z-10 bg-black/20 backdrop-blur-xl border-t border-white/10 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative flex items-end space-x-4">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isListening ? "Listening..." : isSpellChecking ? "Checking spelling..." : "Type your message..."}
                  rows={1}
                  className="w-full px-4 py-3 pr-24 bg-black/40 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 transition-all duration-300 resize-none hover:bg-black/60"
                  style={{
                    minHeight: '48px',
                    maxHeight: '120px'
                  }}
                  disabled={isListening || isSpellChecking}
                />

                {/* Search Options Button */}
                <button
                  onClick={() => setShowSearchOptions(!showSearchOptions)}
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-300 hover:scale-110 bg-blue-500/70 hover:bg-blue-500"
                  disabled={isLoading}
                  title="Search Options"
                >
                  <Search size={16} className="text-white" />
                </button>

                {/* Voice Input Button */}
                {isVoiceSupported && (
                  <button
                    onClick={toggleVoiceInput}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                      isListening
                        ? 'bg-red-500 hover:bg-red-400 animate-pulse'
                        : 'bg-purple-500/70 hover:bg-purple-500'
                    }`}
                    disabled={isLoading}
                  >
                    {isListening ? (
                      <MicOff size={16} className="text-white" />
                    ) : (
                      <Mic size={16} className="text-white" />
                    )}
                  </button>
                )}

                {/* Search Options Dropdown */}
                {showSearchOptions && (
                  <div
                    ref={searchOptionsRef}
                    className="absolute bottom-full left-0 mb-2 w-64 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-3 shadow-xl z-50"
                  >
                    <h4 className="text-white font-medium mb-3 flex items-center">
                      <Search size={16} className="mr-2" />
                      Search Options
                    </h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          performSearch(inputMessage, 'general');
                          setShowSearchOptions(false);
                        }}
                        disabled={!inputMessage.trim() || isLoading}
                        className="w-full text-left p-2 hover:bg-white/10 rounded-lg transition-colors duration-200 flex items-center space-x-2 text-white disabled:opacity-50"
                      >
                        <Globe size={16} className="text-blue-400" />
                        <span>Enhanced Search (Multiple Sources)</span>
                      </button>
                      <button
                        onClick={() => {
                          performSearch(inputMessage, 'google');
                          setShowSearchOptions(false);
                        }}
                        disabled={!inputMessage.trim() || isLoading}
                        className="w-full text-left p-2 hover:bg-white/10 rounded-lg transition-colors duration-200 flex items-center space-x-2 text-white disabled:opacity-50"
                      >
                        <Search size={16} className="text-green-400" />
                        <span>Google Search</span>
                      </button>
                      <button
                        onClick={() => {
                          performSearch(inputMessage, 'knowledge');
                          setShowSearchOptions(false);
                        }}
                        disabled={!inputMessage.trim() || isLoading}
                        className="w-full text-left p-2 hover:bg-white/10 rounded-lg transition-colors duration-200 flex items-center space-x-2 text-white disabled:opacity-50"
                      >
                        <BookOpen size={16} className="text-purple-400" />
                        <span>Knowledge Base</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Spell Check Indicator */}
                {isSpellChecking && (
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-blue-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2 animate-pulse">
                    <CheckCircle size={12} />
                    <span>Checking spelling...</span>
                  </div>
                )}

                {/* Listening Indicator */}
                {isListening && (
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-red-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2 animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                    <span>Listening...</span>
                  </div>
                )}

                {/* Input glow effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r transition-opacity duration-300 pointer-events-none blur-xl ${
                  isListening
                    ? 'from-red-500/30 to-pink-500/30 opacity-100'
                    : 'from-purple-500/20 to-pink-500/20 opacity-0 focus-within:opacity-100'
                }`}></div>
              </div>

              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading || isListening}
                className="relative p-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 disabled:from-gray-500 disabled:to-gray-600 rounded-2xl text-white transition-all duration-300 hover:scale-110 disabled:scale-100 disabled:opacity-50 group shadow-xl hover:shadow-purple-500/50"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send size={24} className="group-hover:translate-x-1 transition-transform duration-300" />
                )}

                {/* Button glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300"></div>
              </button>
            </div>

            {/* Feature Help Text */}
            <div className="mt-2 text-center space-y-1">
              {isVoiceSupported && !isListening && (
                <p className="text-xs text-gray-400 flex items-center justify-center space-x-1">
                  <Mic size={12} />
                  <span>Voice input</span>
                  <span className="text-gray-500">•</span>
                  <Search size={12} />
                  <span>Advanced search</span>
                  <span className="text-gray-500">•</span>
                  <CheckCircle size={12} />
                  <span>Auto spell-check</span>
                </p>
              )}

              {!isVoiceSupported && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 flex items-center justify-center space-x-1">
                    <Search size={12} />
                    <span>Advanced search</span>
                    <span className="text-gray-500">•</span>
                    <CheckCircle size={12} />
                    <span>Auto spell-check</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Voice input not supported in this browser
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fadeInUp {
            animation: fadeInUp 0.5s ease-out forwards;
          }

          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 6px;
          }

          ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 3px;
          }

          ::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #8b5cf6, #3b82f6);
            border-radius: 3px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #7c3aed, #2563eb);
          }
        `}</style>
      </div>
    </div>
    </div>
  );
}