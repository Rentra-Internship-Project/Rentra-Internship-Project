import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiPackage, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const result = login({ email, password });
      if (result.success) {
        navigate('/owner/dashboard', { replace: true });
      } else {
        setError(result.message);
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[20px] bg-[#CCCCFF] mb-4 shadow-lg">
            <FiPackage className="text-3xl text-[#0F172A]" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">RENTRA</h1>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mt-1">Owner Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-8 shadow-xs">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#0F172A]">Welcome Back</h2>
            <p className="text-sm text-[#64748B] mt-1">Sign in to manage your equipment and bookings</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-[#EF4444] text-xs font-semibold rounded-[12px]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] text-sm" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@rentra.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-[#E2E8F0] rounded-[12px] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] text-sm" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-[#E2E8F0] rounded-[12px] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] transition-colors"
                >
                  {showPassword ? <FiEyeOff className="text-sm" /> : <FiEye className="text-sm" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#CCCCFF] hover:bg-[#B8B8FF] text-[#0F172A] font-semibold text-sm rounded-[12px] transition-all disabled:opacity-50 shadow-sm"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-[#0F172A]/20 border-t-[#0F172A] rounded-full"
                />
              ) : (
                <>
                  Sign In <FiArrowRight className="text-sm" />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-2">Demo Credentials</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#64748B]">Email:</span>
              <span className="font-mono font-semibold text-[#0F172A]">owner@rentra.com</span>
            </div>
            <div className="flex items-center gap-2 text-xs mt-1">
              <span className="text-[#64748B]">Password:</span>
              <span className="font-mono font-semibold text-[#0F172A]">owner123</span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-[#94A3B8] mt-6">
          © 2026 Rentra. Heavy Machinery & Business Asset Rental Marketplace.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
