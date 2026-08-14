import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend, FiMinimize2 } from 'react-icons/fi';
import { chatService } from '../../services/api';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi there! 👋 I'm Rentra's AI support assistant. How can I help you today?", role: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    // Add user message to UI
    const newMessages = [...messages, { text: userMessage, role: 'user' }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chatService.sendMessage(newMessages);
      const reply = response.data.reply;
      
      setMessages(prev => [...prev, { text: reply, role: 'bot' }]);
    } catch (error) {
      console.error('Chat API Error:', error);
      setMessages(prev => [...prev, { 
        text: "I'm having trouble connecting to my brain right now. Please try again later or contact support@rentra.com.", 
        role: 'bot' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Helper to safely format simple markdown (bold text) since we requested plain text but Gemini might still send **
  const formatText = (text) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line.replace(/\*\*(.*?)\*\*/g, '$1')}
        <br />
      </span>
    ));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-[#0F172A] text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-[#1E293B] transition-colors group relative"
          >
            <FiMessageSquare className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CCCCFF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#5D5DEB]"></span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 right-0 w-80 sm:w-96 bg-white rounded-[24px] shadow-2xl border border-[#E2E8F0] overflow-hidden flex flex-col h-[500px] max-h-[80vh]"
          >
            {/* Header */}
            <div className="bg-[#0F172A] p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5D5DEB] to-[#CCCCFF] flex items-center justify-center shadow-inner">
                  <FiMessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm flex items-center gap-2">
                    Rentra AI
                    <span className="px-1.5 py-0.5 rounded-full bg-[#CCCCFF]/20 text-[#CCCCFF] text-[9px] uppercase tracking-wider font-bold">Beta</span>
                  </h3>
                  <p className="text-[10px] text-[#94A3B8] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                <FiMinimize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-[#F8FAFC] to-white space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'bot' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] rounded-[16px] px-4 py-3 text-[13px] sm:text-sm leading-relaxed ${
                    msg.role === 'bot' 
                      ? 'bg-white text-[#0F172A] border border-[#E2E8F0] shadow-sm rounded-tl-none' 
                      : 'bg-[#0F172A] text-white font-medium shadow-sm rounded-br-none'
                  }`}>
                    {msg.role === 'bot' ? formatText(msg.text) : msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-[16px] rounded-tl-none px-4 py-3 flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-[#94A3B8] rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-[#94A3B8] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                    <span className="w-1.5 h-1.5 bg-[#94A3B8] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-[#E2E8F0]">
              <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[20px] p-1.5 pl-4 focus-within:border-[#0F172A] focus-within:ring-2 focus-within:ring-[#0F172A]/10 transition-all">
                <input
                  type="text"
                  placeholder="Ask Rentra AI..."
                  className="flex-1 bg-transparent border-none focus:outline-none text-sm text-[#0F172A] placeholder:text-[#94A3B8]"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  disabled={isTyping}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="w-8 h-8 rounded-full bg-[#0F172A] text-white flex items-center justify-center disabled:opacity-50 hover:bg-[#1E293B] transition-colors"
                >
                  <FiSend className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingChatbot;
