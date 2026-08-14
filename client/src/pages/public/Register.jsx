import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiEye, FiEyeOff, FiLock, FiMail, FiPackage, FiPhone, FiUser } from 'react-icons/fi';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'owner' ? 'owner' : 'customer';
  const [role, setRole] = useState(initialRole);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!agreedToTerms) {
      setError('You must agree to the Terms & Conditions and Privacy Policy');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    const result = await register({ name, email, phone, password, role: role.toUpperCase() });

    if (result.success) {
      const userRole = result.user?.role?.toUpperCase();
      if (userRole === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (userRole === 'OWNER') {
        navigate('/owner/dashboard', { replace: true });
      } else {
        navigate('/customer/dashboard', { replace: true });
      }
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[32px] border border-[#E2E8F0] bg-white shadow-[0_25px_90px_-30px_rgba(15,23,42,0.25)]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-gradient-to-br from-[#CCCCFF] via-[#E6E6FF] to-[#F8FAFC] p-10 lg:flex"
        >
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ y: [0, -10, 0], x: [0, 10, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-[-8%] top-[-6%] h-36 w-36 rounded-full bg-white/50 blur-3xl"
            />
            <motion.div
              animate={{ y: [0, 15, 0], x: [0, -8, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-[-8%] right-[-6%] h-40 w-40 rounded-full bg-[#0F172A]/10 blur-3xl"
            />
          </div>

          <div className="relative">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-[20px] bg-white/80 shadow-sm">
              <FiPackage className="text-2xl text-[#0F172A]" />
            </div>
            <h1 className="mt-6 text-3xl font-semibold text-[#0F172A]">Create Your Rentra Account</h1>
            <p className="mt-3 max-w-md text-lg leading-8 text-[#475569]">
              Join a modern rental marketplace designed to make heavy equipment access simple and trusted.
            </p>
          </div>

          <div className="relative rounded-[24px] border border-white/60 bg-white/70 p-5 backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#64748B]">Why it feels premium</p>
            <div className="mt-3 flex items-center gap-3 text-sm text-[#0F172A]">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#CCCCFF]">✓</span>
              Smooth onboarding, fast access, and clear guidance.
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="flex-1 p-6 sm:p-8 lg:p-10"
        >
          <div className="mx-auto max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-semibold text-[#0F172A]">Register</h2>
              <p className="mt-2 text-sm leading-7 text-[#64748B]">Start your journey with a secure, polished experience.</p>
            </div>

            {error && (
              <div className="mb-4 rounded-[14px] border border-red-200 bg-red-50 px-3 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#0F172A]">Full Name</label>
                  <div className="relative">
                    <FiUser className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Carter"
                      className="w-full rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] py-3 pl-10 pr-3 text-sm text-[#0F172A] outline-none transition focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#0F172A]">Email</label>
                  <div className="relative">
                    <FiMail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@rentra.com"
                      className="w-full rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] py-3 pl-10 pr-3 text-sm text-[#0F172A] outline-none transition focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#0F172A]">Phone</label>
                  <div className="relative">
                    <FiPhone className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 123-4567"
                      className="w-full rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] py-3 pl-10 pr-3 text-sm text-[#0F172A] outline-none transition focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#0F172A]">Password</label>
                  <div className="relative">
                    <FiLock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                      className="w-full rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] py-3 pl-10 pr-10 text-sm text-[#0F172A] outline-none transition focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] transition hover:text-[#0F172A]"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#0F172A]">Confirm Password</label>
                  <div className="relative">
                    <FiLock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] py-3 pl-10 pr-10 text-sm text-[#0F172A] outline-none transition focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] transition hover:text-[#0F172A]"
                    >
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#0F172A]">Role</label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {['customer', 'owner'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setRole(option)}
                      className={`rounded-[14px] border px-4 py-3 text-sm font-semibold transition ${role === option ? 'border-[#CCCCFF] bg-[#F5F7FF] text-[#0F172A]' : 'border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#CCCCFF]'}`}
                    >
                      {option === 'customer' ? 'Customer' : 'Owner'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-3 mt-4">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-[#E2E8F0] text-[#0F172A] focus:ring-[#CCCCFF]"
                />
                <label htmlFor="terms" className="text-sm text-[#475569]">
                  I agree to the{' '}
                  <Link to="/terms" target="_blank" className="font-semibold text-[#5D5DEB] hover:underline">
                    Terms & Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" target="_blank" className="font-semibold text-[#5D5DEB] hover:underline">
                    Privacy Policy
                  </Link>.
                </label>
              </div>

              <motion.button
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-[14px] bg-[#0F172A] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1E293B] disabled:opacity-70"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white"
                  />
                ) : (
                  <>
                    Register <FiArrowRight className="ml-2" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-6 flex items-center justify-between">
              <span className="w-1/5 border-b border-[#E2E8F0] lg:w-1/4"></span>
              <span className="text-xs text-[#64748B] uppercase font-semibold text-center w-3/5 lg:w-1/2">Or sign up with</span>
              <span className="w-1/5 border-b border-[#E2E8F0] lg:w-1/4"></span>
            </div>

            <button
              type="button"
              onClick={() => {
                const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
                window.location.href = `${apiBase}/auth/google?role=${role}`;
              }}
              className="mt-4 flex w-full items-center justify-center gap-3 rounded-[14px] border border-[#E2E8F0] bg-white px-4 py-3 text-sm font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
              Continue with Google
            </button>

            <p className="mt-6 text-center text-sm text-[#64748B]">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[#0F172A] transition hover:text-[#5D5DEB]">
                Login
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
