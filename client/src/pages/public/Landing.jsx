import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiTrendingUp, FiCheckCircle, FiClock, FiSettings, FiMapPin, FiTruck, FiBriefcase, FiTool, FiChevronDown, FiUserCheck, FiSearch, FiFileText } from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
import FloatingChatbot from '../../components/common/FloatingChatbot';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const Landing = () => {
  useDocumentTitle('Heavy Equipment & Machinery Rental Marketplace', 'Rentra connects contractors, businesses, and equipment owners for secure, high-value industrial machinery rentals with escrow deposit security and verified listings.');

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A] selection:bg-[#CCCCFF] selection:text-[#0F172A] flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] shadow-sm">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0F172A]">.Rentra</span>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-[#64748B]">
            <a href="#about" className="hover:text-[#0F172A] transition-colors">What is Rentra?</a>
            <a href="#how-it-works" className="hover:text-[#0F172A] transition-colors">How it Works</a>
            <a href="#industries" className="hover:text-[#0F172A] transition-colors">Industries</a>
            <a href="#solutions" className="hover:text-[#0F172A] transition-colors">Solutions</a>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <Link to="/login" className="hidden sm:block text-sm font-semibold text-[#0F172A] hover:text-[#5D5DEB] transition-colors">
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-[12px] bg-[#0F172A] text-white text-xs sm:text-sm font-semibold hover:bg-[#1E293B] transition-colors shadow-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-16 sm:pt-20">
        
        {/* Full-width Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#F8FAFC] via-[#E6E6FF] to-[#CCCCFF] border-b border-[#E2E8F0]">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute left-[-20%] top-[-10%] h-[300px] w-[300px] sm:h-[800px] sm:w-[800px] rounded-full bg-white/50 blur-[80px] sm:blur-[150px]" />
            <div className="absolute bottom-[-10%] right-[-20%] h-[400px] w-[400px] sm:h-[900px] sm:w-[900px] rounded-full bg-[#0F172A]/5 blur-[80px] sm:blur-[150px]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/70 border border-white backdrop-blur-md shadow-sm text-[10px] sm:text-sm font-semibold text-[#0F172A] mb-6 sm:mb-8">
              <span className="flex h-2 w-2 rounded-full bg-[#5D5DEB] animate-pulse"></span>
              The premier B2B and B2C marketplace for heavy equipment
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-[#0F172A] tracking-tight leading-[1.15] max-w-5xl">
              Equip your projects. <br className="hidden sm:block" /> Monetize your fleet.
            </h1>
            
            <p className="mt-4 sm:mt-6 text-sm sm:text-xl text-[#475569] max-w-3xl leading-relaxed px-2">
              Rentra is a comprehensive B2B and B2C rental platform connecting asset owners with businesses and individual contractors who need machinery. Stop relying on outdated phone directories. Rent heavy equipment with transparent pricing, instant availability, and guaranteed escrow protection.
            </p>

            <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto px-4 sm:px-0">
              <Link 
                to="/register?role=customer" 
                className="w-full sm:w-auto px-6 py-4 sm:px-8 sm:py-4 rounded-[14px] bg-[#0F172A] text-white text-sm sm:text-base font-semibold hover:bg-[#1E293B] transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-800/20"
              >
                Rent Equipment (Customer) <FiArrowRight />
              </Link>
              <Link 
                to="/register?role=owner" 
                className="w-full sm:w-auto px-6 py-4 sm:px-8 sm:py-4 rounded-[14px] bg-white border border-[#E2E8F0] text-[#0F172A] text-sm sm:text-base font-semibold hover:border-[#CCCCFF] hover:bg-[#F8FAFC] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                List Your Fleet (Owner)
              </Link>
            </div>
            <p className="mt-4 text-xs text-[#64748B] font-medium">Already have an account? <Link to="/login" className="text-[#5D5DEB] hover:underline">Sign In here.</Link></p>
          </div>
        </section>

        {/* Social Proof / Statistics */}
        <section className="bg-white border-b border-[#E2E8F0] overflow-hidden">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 sm:py-16">
            <p className="text-center text-[10px] sm:text-sm font-bold uppercase tracking-widest text-[#94A3B8] mb-8 sm:mb-12">Trusted by industry leaders nationwide</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0]">
              <div className="pt-4 md:pt-0">
                <p className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] mb-1 sm:mb-2">5,000+</p>
                <p className="text-[11px] sm:text-sm font-semibold text-[#64748B]">Verified Contractors</p>
              </div>
              <div className="pt-4 md:pt-0">
                <p className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] mb-1 sm:mb-2">15,000+</p>
                <p className="text-[11px] sm:text-sm font-semibold text-[#64748B]">Active Listings</p>
              </div>
              <div className="pt-4 md:pt-0">
                <p className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] mb-1 sm:mb-2">100%</p>
                <p className="text-[11px] sm:text-sm font-semibold text-[#64748B]">Escrow Protection</p>
              </div>
              <div className="pt-4 md:pt-0">
                <p className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] mb-1 sm:mb-2">₹50Cr+</p>
                <p className="text-[11px] sm:text-sm font-semibold text-[#64748B]">Transaction Volume</p>
              </div>
            </div>
          </div>
        </section>

        {/* What is Rentra? (Educational Section) */}
        <section id="about" className="py-16 sm:py-28 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] mb-4">What is Rentra?</h2>
              <p className="text-sm sm:text-lg text-[#64748B] leading-relaxed">
                The heavy equipment rental industry has traditionally been fragmented, opaque, and highly localized. Finding the right machinery meant making dozens of phone calls, negotiating rates blindly, and dealing with risky cash transactions. Rentra changes everything. 
                <br /><br />
                We are a centralized B2B and B2C digital ecosystem. We connect contractors, builders, and businesses (acting as our Customers) who need machinery with verified fleet Owners who have idle assets. We handle the discovery, the background checks, the contractual agreements, and the financial settlement.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-[#E2E8F0] shadow-sm">
                <div className="w-12 h-12 bg-[#F1F5F9] rounded-xl flex items-center justify-center mb-6">
                  <FiSearch className="text-xl text-[#0F172A]" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] mb-3">Centralized Discovery</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">Instantly search our nationwide database for specific equipment types. Filter by location, price, and availability in real-time.</p>
              </div>
              <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-[#E2E8F0] shadow-sm">
                <div className="w-12 h-12 bg-[#F1F5F9] rounded-xl flex items-center justify-center mb-6">
                  <FiShield className="text-xl text-[#0F172A]" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] mb-3">Absolute Trust</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">Every owner on our platform undergoes strict KYC compliance (Aadhar/PAN verification) and every machine is vetted for quality.</p>
              </div>
              <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-[#E2E8F0] shadow-sm">
                <div className="w-12 h-12 bg-[#F1F5F9] rounded-xl flex items-center justify-center mb-6">
                  <FaRupeeSign className="text-xl text-[#0F172A]" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] mb-3">Financial Security</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">We hold all deposits in a secure escrow account until the rental concludes, ensuring neither the customer nor the owner is ever scammed.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="py-16 sm:py-28 bg-white border-y border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A]">How Rentra Works</h2>
              <p className="mt-4 text-sm sm:text-lg text-[#64748B]">A seamless, four-step operational flow designed to protect both parties and streamline operations.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="relative p-6 sm:p-0">
                <div className="w-10 h-10 bg-[#0F172A] text-white rounded-full flex items-center justify-center font-bold mb-4 shadow-md">1</div>
                <h4 className="text-base sm:text-lg font-bold text-[#0F172A] mb-2">Request & Match</h4>
                <p className="text-sm text-[#64748B] leading-relaxed">Contractors search the marketplace and request dates. Verified owners review the job site details and approve the booking.</p>
              </div>
              <div className="relative p-6 sm:p-0">
                <div className="w-10 h-10 bg-[#0F172A] text-white rounded-full flex items-center justify-center font-bold mb-4 shadow-md">2</div>
                <h4 className="text-base sm:text-lg font-bold text-[#0F172A] mb-2">Secure Deposit</h4>
                <p className="text-sm text-[#64748B] leading-relaxed">Funds are securely captured via integrated payment gateways and held in our escrow system.</p>
              </div>
              <div className="relative p-6 sm:p-0">
                <div className="w-10 h-10 bg-[#0F172A] text-white rounded-full flex items-center justify-center font-bold mb-4 shadow-md">3</div>
                <h4 className="text-base sm:text-lg font-bold text-[#0F172A] mb-2">Active Rental</h4>
                <p className="text-sm text-[#64748B] leading-relaxed">Equipment is delivered or picked up. The platform tracks the rental timeline and maintains communication channels.</p>
              </div>
              <div className="relative p-6 sm:p-0">
                <div className="w-10 h-10 bg-[#0F172A] text-white rounded-full flex items-center justify-center font-bold mb-4 shadow-md">4</div>
                <h4 className="text-base sm:text-lg font-bold text-[#0F172A] mb-2">Return & Settlement</h4>
                <p className="text-sm text-[#64748B] leading-relaxed">Equipment is returned. Final usage is verified, and automated financial settlement is triggered instantly to the owner.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Industries Served */}
        <section id="industries" className="py-16 sm:py-28 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A]">Built for every sector</h2>
              <p className="mt-4 text-sm sm:text-lg text-[#64748B]">Our vast network supplies machinery to a diverse range of critical industries, ensuring you have the right tool for any job.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { title: 'Construction', desc: 'Excavators, cranes, and heavy earthmovers for major infrastructure.', icon: FiTool },
                { title: 'Logistics', desc: 'Forklifts and telehandlers for massive warehouse operations.', icon: FiTruck },
                { title: 'Agriculture', desc: 'Tractors and harvesters for seasonal farming demands.', icon: FiMapPin },
                { title: 'Events', desc: 'Generators and lighting rigs for massive outdoor festivals.', icon: FiBriefcase }
              ].map((ind, i) => (
                <div key={i} className="bg-white border border-[#E2E8F0] rounded-[24px] p-6 sm:p-8 hover:border-[#CCCCFF] transition-all hover:shadow-lg">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F1F5F9] text-[#0F172A] rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                    <ind.icon className="text-lg sm:text-xl" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] mb-2 sm:mb-3">{ind.title}</h3>
                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">{ind.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions Grid */}
        <section id="solutions" className="py-16 sm:py-28 bg-white border-y border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A]">A dual-sided ecosystem designed for growth</h2>
              <p className="mt-4 text-sm sm:text-lg text-[#64748B]">Whether you're sourcing equipment to hit project deadlines or optimizing your fleet's utilization rate, Rentra provides the necessary infrastructure.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* For Customers */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[24px] sm:rounded-[32px] p-6 sm:p-12 hover:shadow-lg transition-shadow">
                <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-6 sm:mb-8">For Contractors</div>
                <h3 className="text-xl sm:text-3xl font-bold text-[#0F172A] mb-3 sm:mb-4">Source machinery instantly</h3>
                <p className="text-sm sm:text-lg text-[#64748B] mb-6 sm:mb-8 leading-relaxed">Stop relying on outdated directories. Find high-quality, verified machinery near your job site with transparent pricing and immediate availability.</p>
                
                <ul className="space-y-4 sm:space-y-5 mb-8 sm:mb-10">
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-[#0F172A] mt-1 shrink-0 text-base sm:text-lg" />
                    <span className="text-sm sm:text-base font-semibold text-[#0F172A]">Nationwide Inventory Access</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-[#0F172A] mt-1 shrink-0 text-base sm:text-lg" />
                    <span className="text-sm sm:text-base font-semibold text-[#0F172A]">Zero Hidden Fees or Markups</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-[#0F172A] mt-1 shrink-0 text-base sm:text-lg" />
                    <span className="text-sm sm:text-base font-semibold text-[#0F172A]">Secure Escrow Payment Protection</span>
                  </li>
                </ul>

                <Link to="/register?role=customer" className="inline-flex items-center gap-2 text-white bg-[#0F172A] px-5 py-3 sm:px-6 sm:py-3 rounded-xl text-sm sm:text-base font-semibold hover:bg-[#1E293B] transition-colors w-full sm:w-auto justify-center">
                  Create Customer Account <FiArrowRight />
                </Link>
              </div>

              {/* For Owners */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[24px] sm:rounded-[32px] p-6 sm:p-12 hover:shadow-lg transition-shadow">
                <div className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-6 sm:mb-8">For Fleet Owners</div>
                <h3 className="text-xl sm:text-3xl font-bold text-[#0F172A] mb-3 sm:mb-4">Monetize idle assets</h3>
                <p className="text-sm sm:text-lg text-[#64748B] mb-6 sm:mb-8 leading-relaxed">Transform depreciating machinery into revenue engines. We provide the marketplace, rigorous KYC verification, and guaranteed financial settlements.</p>
                
                <ul className="space-y-4 sm:space-y-5 mb-8 sm:mb-10">
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-[#0F172A] mt-1 shrink-0 text-base sm:text-lg" />
                    <span className="text-sm sm:text-base font-semibold text-[#0F172A]">Strict Contractor KYC Verification</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-[#0F172A] mt-1 shrink-0 text-base sm:text-lg" />
                    <span className="text-sm sm:text-base font-semibold text-[#0F172A]">Automated Billing & Invoicing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-[#0F172A] mt-1 shrink-0 text-base sm:text-lg" />
                    <span className="text-sm sm:text-base font-semibold text-[#0F172A]">Guaranteed Security Deposits</span>
                  </li>
                </ul>

                <Link to="/register?role=owner" className="inline-flex items-center gap-2 text-[#0F172A] bg-white border border-[#E2E8F0] px-5 py-3 sm:px-6 sm:py-3 rounded-xl text-sm sm:text-base font-semibold hover:border-[#CCCCFF] transition-colors shadow-sm w-full sm:w-auto justify-center">
                  Register Business <FiArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 sm:py-28 bg-[#F8FAFC]">
          <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A]">Frequently Asked Questions</h2>
              <p className="mt-4 text-sm sm:text-lg text-[#64748B]">Everything you need to know about the product and billing.</p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {[
                { q: 'How does the Escrow system work?', a: 'When a booking is approved, the customer pays a security deposit. These funds are held securely in escrow by Rentra. Once the rental is completed successfully, the deposit is released or applied to the final balance.' },
                { q: 'What is the verification process for Fleet Owners?', a: 'To ensure a high-quality marketplace, all Fleet Owners must provide government-issued KYC documents (Aadhar, PAN) and verified bank details. Our admin team manually reviews and approves all business applications.' },
                { q: 'Are there any hidden fees?', a: 'No. Rentra charges a transparent platform fee on successful rentals. There are no monthly subscription costs to list your equipment or browse the marketplace.' },
                { q: 'Who handles the logistics and delivery?', a: 'Delivery terms are negotiated directly between the Contractor and the Fleet Owner. Owners can specify flat-rate delivery charges when approving a booking request.' },
              ].map((faq, i) => (
                <div key={i} className="bg-white border border-[#E2E8F0] rounded-[16px] sm:rounded-[20px] p-5 sm:p-8">
                  <h4 className="text-base sm:text-lg font-bold text-[#0F172A] mb-2 sm:mb-3">{faq.q}</h4>
                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-[#CCCCFF] via-[#E6E6FF] to-[#F8FAFC] py-20 sm:py-32 border-t border-[#E2E8F0]">
          <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] mb-4 sm:mb-6 tracking-tight">Ready to modernize your operations?</h2>
            <p className="text-sm sm:text-xl text-[#475569] mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
              Join thousands of businesses already scaling their infrastructure and increasing their revenue on Rentra.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 sm:px-0">
                <Link 
                  to="/register?role=customer" 
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 sm:px-8 sm:py-5 rounded-[14px] sm:rounded-[16px] bg-[#0F172A] text-white text-sm sm:text-lg font-bold hover:bg-[#1E293B] transition-all shadow-xl shadow-slate-800/30 gap-3"
                >
                  Join as Customer <FiArrowRight />
                </Link>
                <Link 
                  to="/register?role=owner" 
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 sm:px-8 sm:py-5 rounded-[14px] sm:rounded-[16px] bg-white text-[#0F172A] border border-[#E2E8F0] text-sm sm:text-lg font-bold hover:border-[#CCCCFF] transition-all shadow-sm gap-3"
                >
                  Join as Fleet Owner <FiArrowRight />
                </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0F172A] py-12 sm:py-24 text-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 sm:gap-8 mb-12 sm:mb-16">
            <div className="col-span-1 sm:col-span-2">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-4 sm:mb-6 block">.Rentra</span>
              <p className="text-[#94A3B8] text-xs sm:text-sm max-w-sm leading-relaxed">
                The modern B2B and B2C marketplace for heavy equipment rentals. Built for reliability, impenetrable security, and infinite scale.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white text-base sm:text-lg mb-4 sm:mb-6">Platform</h4>
              <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-[#94A3B8]">
                <li><Link to="/register?role=customer" className="hover:text-white transition-colors">For Contractors</Link></li>
                <li><Link to="/register?role=owner" className="hover:text-white transition-colors">For Fleet Owners</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing & Fees</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security Architecture</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white text-base sm:text-lg mb-4 sm:mb-6">Company</h4>
              <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-[#94A3B8]">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms & Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-xs text-[#64748B]">
            <p className="text-center sm:text-left">&copy; {new Date().getFullYear()} Rentra Technologies Inc. All rights reserved.</p>
            <div className="flex gap-4 sm:gap-6">
              <a href="#" className="hover:text-white transition-colors">System Status</a>
              <a href="#" className="hover:text-white transition-colors">Trust & Safety Center</a>
            </div>
          </div>
        </div>
      </footer>
      <FloatingChatbot />
    </div>
  );
};

export default Landing;
