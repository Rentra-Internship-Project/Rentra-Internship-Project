import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiBox, FiCheckCircle, FiClock, FiPackage, FiShield, FiStar, FiTrendingUp } from 'react-icons/fi';

const steps = [
  {
    title: 'Browse Equipment',
    description: 'Explore professionally listed machinery from trusted owners in your area.',
    icon: FiBox,
  },
  {
    title: 'Book Securely',
    description: 'Reserve equipment with transparent pricing, simple checkout, and verified availability.',
    icon: FiShield,
  },
  {
    title: 'Start Working',
    description: 'Pick up your rental and get to work with confidence and minimal friction.',
    icon: FiClock,
  },
];

const reasons = [
  {
    title: 'Verified Owners',
    description: 'Work with trusted operators and well-reviewed equipment providers.',
    icon: FiCheckCircle,
  },
  {
    title: 'Secure Booking',
    description: 'Protect your rental experience with clear booking and payment flow.',
    icon: FiShield,
  },
  {
    title: 'Affordable Rentals',
    description: 'Access premium machinery without the heavy upfront cost of ownership.',
    icon: FiTrendingUp,
  },
  {
    title: 'Easy Management',
    description: 'Keep bookings, schedules, and equipment updates simple and organized.',
    icon: FiPackage,
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <main className="mx-auto flex max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-[32px] border border-[#E2E8F0] bg-gradient-to-br from-[#CCCCFF]/35 via-white to-[#F8FAFC] p-6 shadow-[0_20px_80px_-28px_rgba(15,23,42,0.25)] sm:p-8 lg:p-12"
        >
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ y: [0, -12, 0], x: [0, 8, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-[-6%] top-[-8%] h-40 w-40 rounded-full bg-[#CCCCFF]/40 blur-3xl"
            />
            <motion.div
              animate={{ y: [0, 16, 0], x: [0, -10, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-[-10%] right-[-2%] h-48 w-48 rounded-full bg-[#0F172A]/10 blur-3xl"
            />
          </div>

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D9D9FF] bg-white/80 px-3 py-1.5 text-sm font-semibold text-[#475569] shadow-sm">
                <FiStar className="text-[#5D5DEB]" />
                Premium equipment rentals, simplified
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.55 }}
                className="text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl lg:text-6xl"
              >
                Rent Heavy Equipment Without Buying
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.55 }}
                className="mt-5 max-w-xl text-lg leading-8 text-[#64748B]"
              >
                Connect with verified equipment owners and rent machinery easily, safely, and affordably.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.55 }}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center justify-center rounded-full bg-[#0F172A] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1E293B]"
                >
                  Browse Equipment <FiArrowRight className="ml-2" />
                </button>
              
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="relative"
            >
              <div className="rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.28)] backdrop-blur">
                <div className="rounded-[24px] border border-[#E2E8F0] bg-gradient-to-br from-[#F8FAFC] to-[#F5F7FF] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#64748B]">Available Today</p>
                      <p className="text-xl font-semibold text-[#0F172A]">12 premium machines</p>
                    </div>
                    <div className="rounded-full bg-[#CCCCFF] px-3 py-1 text-sm font-semibold text-[#0F172A]">
                      Verified
                    </div>
                  </div>

                  <div className="rounded-[24px] bg-[#0F172A] p-6 text-white">
                    <svg viewBox="0 0 400 240" className="h-56 w-full" role="img" aria-label="Construction equipment illustration">
                      <rect x="40" y="160" width="320" height="16" rx="8" fill="#334155" />
                      <rect x="88" y="92" width="140" height="74" rx="16" fill="#CCCCFF" />
                      <rect x="114" y="70" width="92" height="30" rx="10" fill="#F8FAFC" />
                      <rect x="128" y="50" width="56" height="24" rx="8" fill="#F8FAFC" />
                      <rect x="240" y="122" width="88" height="50" rx="12" fill="#F8FAFC" />
                      <rect x="260" y="90" width="48" height="34" rx="10" fill="#CCCCFF" />
                      <circle cx="118" cy="170" r="30" fill="#F8FAFC" />
                      <circle cx="282" cy="170" r="30" fill="#F8FAFC" />
                      <circle cx="118" cy="170" r="12" fill="#0F172A" />
                      <circle cx="282" cy="170" r="12" fill="#0F172A" />
                      <rect x="200" y="108" width="22" height="34" rx="6" fill="#F8FAFC" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="mt-8 rounded-[28px] border border-[#E2E8F0] bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#64748B]">How Rentra Works</p>
            <h2 className="mt-2 text-3xl font-semibold text-[#0F172A]">Simple, trusted, and seamless</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.08, duration: 0.35 }}
                  whileHover={{ y: -6, scale: 1.01, boxShadow: '0 20px 45px -20px rgba(15,23,42,0.22)' }}
                  className="rounded-[22px] border border-[#E2E8F0] bg-[#F8FAFC] p-6"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#CCCCFF] text-[#0F172A]">
                    <Icon className="text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#0F172A]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#64748B]">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="mt-8 rounded-[28px] border border-[#E2E8F0] bg-gradient-to-br from-white to-[#F8FAFC] p-6 shadow-sm sm:p-8"
        >
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#64748B]">Why Choose Rentra</p>
            <h2 className="mt-2 text-3xl font-semibold text-[#0F172A]">Built for confidence and speed</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {reasons.map((reason, index) => {
              const Icon = reason.icon;
              return (
                <motion.div
                  key={reason.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.06, duration: 0.35 }}
                  whileHover={{ y: -6, scale: 1.01, boxShadow: '0 20px 45px -20px rgba(15,23,42,0.2)' }}
                  className="rounded-[22px] border border-[#E2E8F0] bg-white p-6"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F7FF] text-[#5D5DEB]">
                    <Icon className="text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0F172A]">{reason.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#64748B]">{reason.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
          className="mt-8"
        >
          <div className="rounded-[32px] border border-[#E2E8F0] bg-[#0F172A] p-8 text-center text-white shadow-[0_25px_90px_-28px_rgba(15,23,42,0.4)] sm:p-10">
            <h2 className="text-3xl font-semibold">Ready to Rent Equipment?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-300">
              Find equipment or become an owner today and experience a smarter way to work.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center justify-center rounded-full bg-[#CCCCFF] px-6 py-3.5 text-sm font-semibold text-[#0F172A] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#B9B9FF]"
              >
                Get Started <FiArrowRight className="ml-2" />
              </button>

            </div>
          </div>
        </motion.section>
      </main>

      <footer className="border-t border-[#E2E8F0] bg-white/70 px-4 py-6 text-center text-sm text-[#64748B] sm:px-6 lg:px-8">
        <p>© 2026 Rentra. Heavy machinery rentals made simple.</p>
      </footer>
    </div>
  );
};

export default Home;
