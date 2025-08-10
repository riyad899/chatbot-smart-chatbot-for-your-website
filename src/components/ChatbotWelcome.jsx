import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Sparkles, Zap, Brain, ArrowRight, Bot, Stars, Cpu, Globe, Rocket } from 'lucide-react';

export default function ChatbotWelcome() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const containerRef = useRef(null);

  const features = [
    { icon: Brain, text: "AI-Powered Conversations", color: "text-purple-400" },
    { icon: Zap, text: "Lightning Fast Responses", color: "text-yellow-400" },
    { icon: Sparkles, text: "Smart & Intuitive", color: "text-blue-400" },
    { icon: Rocket, text: "Advanced Technology", color: "text-green-400" },
    { icon: Globe, text: "Global Knowledge", color: "text-pink-400" }
  ];

  // Initialize particles
  useEffect(() => {
    const initialParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 2,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      color: ['purple', 'blue', 'pink', 'yellow', 'green'][Math.floor(Math.random() * 5)]
    }));
    setParticles(initialParticles);
  }, []);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleStartChat = () => {
    navigate('/chat');
  };

  const floatingIcons = [Bot, Cpu, Stars, Globe, Rocket];

  return (
    <div ref={containerRef} className="pt-[80px] min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 overflow-hidden relative">

      {/* Moving Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className={`absolute w-${Math.floor(particle.size)}px h-${Math.floor(particle.size)}px bg-${particle.color}-400 rounded-full opacity-${Math.floor(particle.opacity * 100)} animate-pulse`}
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            background: `radial-gradient(circle, ${
              particle.color === 'purple' ? '#a855f7' :
              particle.color === 'blue' ? '#3b82f6' :
              particle.color === 'pink' ? '#ec4899' :
              particle.color === 'yellow' ? '#eab308' : '#10b981'
            }, transparent)`
          }}
        />
      ))}

      {/* Floating Icons */}
      {floatingIcons.map((Icon, index) => (
        <div
          key={index}
          className="absolute opacity-10 text-white pointer-events-none"
          style={{
            left: `${20 + index * 20}%`,
            top: `${10 + index * 15}%`,
            animation: `float ${3 + index * 0.5}s ease-in-out infinite`,
            animationDelay: `${index * 0.5}s`
          }}
        >
          <Icon size={40 + index * 5} />
        </div>
      ))}

      {/* Mouse Follower */}
      <div
        className="fixed w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30 pointer-events-none transition-all duration-100 ease-out z-50"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          background: `radial-gradient(circle, rgba(168, 85, 247, 0.6), transparent)`
        }}
      />

      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }} />
      </div>

      {/* Pulsing Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
        <div className="absolute top-20 right-20 w-40 h-40 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce"></div>
        <div className="absolute bottom-20 right-40 w-50 h-50 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-ping"></div>
      </div>

      {/* Rotating Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 border border-purple-500/20 rounded-full animate-spin-slow"></div>
        <div className="absolute w-80 h-80 border border-blue-500/20 rounded-full animate-reverse-spin"></div>
        <div className="absolute w-64 h-64 border border-pink-500/20 rounded-full animate-spin-slow"></div>
      </div>

      <div className={`max-w-4xl mx-auto text-center relative z-10 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>

        {/* Enhanced Logo/Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative group">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl transform group-hover:rotate-12 transition-all duration-500 group-hover:scale-110 animate-pulse">
              <MessageCircle size={48} className="text-white group-hover:scale-110 transition-transform duration-300" />
            </div>

            {/* Orbiting Elements */}
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce shadow-lg">
              <Sparkles size={20} className="text-yellow-800" />
            </div>
            <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-green-400 rounded-full animate-ping"></div>
            <div className="absolute top-1/2 -left-8 w-4 h-4 bg-pink-400 rounded-full animate-pulse"></div>

            {/* Rotating Ring Around Logo */}
            <div className="absolute inset-0 w-32 h-32 border-2 border-dashed border-purple-400/50 rounded-full animate-spin-slow -translate-x-4 -translate-y-4"></div>
          </div>
        </div>

        {/* Animated Main Heading */}
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x relative">
            ChatBot
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-ping"></div>
          </span>
        </h1>

        {/* Enhanced Subheading */}
        <p className="text-xl md:text-3xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
          Experience the <span className="text-purple-400 font-semibold animate-pulse">future</span> of conversation with our
          <span className="text-blue-400 font-semibold"> intelligent</span> AI assistant
        </p>

        {/* Enhanced Animated Features */}
        <div className="mb-12 h-20 flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent rounded-full animate-pulse"></div>
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className={`flex items-center space-x-4 transition-all duration-700 ${
                  currentFeature === index
                    ? 'opacity-100 scale-110 translate-x-0'
                    : 'opacity-0 scale-95 translate-x-8 absolute'
                }`}
              >
                <div className="relative">
                  <IconComponent size={32} className={`${feature.color} animate-bounce`} />
                  <div className="absolute inset-0 blur-md animate-pulse" style={{color: feature.color.replace('text-', '')}}></div>
                </div>
                <span className="text-xl text-gray-200 font-semibold tracking-wide">
                  {feature.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Enhanced CTA Button */}
        <div className="mb-16 relative">
          <button
            onClick={handleStartChat}
            className="group relative inline-flex items-center justify-center px-12 py-5 text-xl font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full shadow-2xl hover:shadow-purple-500/50 transform hover:scale-110 transition-all duration-300 hover:from-purple-500 hover:to-blue-500 focus:outline-none focus:ring-4 focus:ring-purple-500/50 animate-pulse hover:animate-none"
          >
            <span className="mr-3 group-hover:animate-bounce">Start Chatting</span>
            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300 animate-pulse" />

            {/* Enhanced Button Effects */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300 animate-pulse"></div>
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500"></div>
          </button>

          {/* Orbiting Elements Around Button */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 pointer-events-none">
            <div className="absolute top-0 left-1/2 w-3 h-3 bg-yellow-400 rounded-full animate-spin-around"></div>
            <div className="absolute top-1/2 right-0 w-2 h-2 bg-pink-400 rounded-full animate-reverse-spin-around"></div>
            <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-blue-400 rounded-full animate-spin-around animation-delay-1000"></div>
          </div>
        </div>

        {/* Enhanced Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { title: "Instant Responses", desc: "Get lightning-fast answers in real-time with advanced AI processing", icon: "⚡", color: "from-yellow-500/20 to-orange-500/20" },
            { title: "Smart Learning", desc: "AI that understands context, learns from interactions, and adapts to you", icon: "🧠", color: "from-purple-500/20 to-pink-500/20" },
            { title: "Always Available", desc: "24/7 intelligent assistance whenever and wherever you need it", icon: "🌟", color: "from-blue-500/20 to-cyan-500/20" }
          ].map((item, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${item.color} backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl transform hover:-translate-y-2 group cursor-pointer`}
              style={{animationDelay: `${index * 200}ms`}}
            >
              <div className="text-4xl mb-4 group-hover:scale-125 group-hover:animate-bounce transition-all duration-300">{item.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">{item.title}</h3>
              <p className="text-gray-300 text-base leading-relaxed group-hover:text-gray-200 transition-colors duration-300">{item.desc}</p>

              {/* Card Glow Effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 bg-gradient-to-r from-purple-500 to-pink-500 blur-xl transition-opacity duration-500"></div>
            </div>
          ))}
        </div>

        {/* Enhanced Footer */}
        <div className="mt-16 space-y-4">
          <div className="flex justify-center space-x-6 text-gray-400">
            <div className="flex items-center space-x-2 animate-pulse">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
              <span className="text-sm">Advanced AI Technology</span>
            </div>
            <div className="flex items-center space-x-2 animate-pulse animation-delay-500">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
              <span className="text-sm">Secure & Private</span>
            </div>
            <div className="flex items-center space-x-2 animate-pulse animation-delay-1000">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
              <span className="text-sm">Built with ❤️</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        @keyframes spin-around {
          from { transform: rotate(0deg) translateX(80px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
        }

        @keyframes reverse-spin-around {
          from { transform: rotate(360deg) translateX(80px) rotate(360deg); }
          to { transform: rotate(0deg) translateX(80px) rotate(0deg); }
        }

        .animate-gradient-x {
          background-size: 400% 400%;
          animation: gradient-x 3s ease infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-reverse-spin {
          animation: reverse-spin 6s linear infinite;
        }

        .animate-spin-around {
          animation: spin-around 4s linear infinite;
        }

        .animate-reverse-spin-around {
          animation: reverse-spin-around 3s linear infinite;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out 0.5s both;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}