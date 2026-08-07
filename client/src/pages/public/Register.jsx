import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiEye, FiEyeOff, FiLock, FiMail, FiPackage, FiPhone, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState('customer');

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

            <form className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#0F172A]">Full Name</label>
                  <div className="relative">
                    <FiUser className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                    <input
                      type="text"
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

              <motion.button
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex w-full items-center justify-center rounded-[14px] bg-[#0F172A] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1E293B]"
              >
                Register <FiArrowRight className="ml-2" />
              </motion.button>
            </form>

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
