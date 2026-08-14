import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const Terms = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-[24px] shadow-sm border border-[#E2E8F0] p-8 sm:p-12">
        <Link to="/" className="inline-flex items-center text-sm font-semibold text-[#64748B] hover:text-[#0F172A] mb-8 transition-colors">
          <FiArrowLeft className="mr-2" /> Back to Home
        </Link>
        <h1 className="text-3xl font-extrabold text-[#0F172A] mb-6">Terms and Conditions</h1>
        <p className="text-sm text-[#64748B] mb-8">Last updated: August 2026</p>
        
        <div className="prose prose-sm sm:prose-base text-[#475569] space-y-6">
          <section>
            <h2 className="text-lg font-bold text-[#0F172A]">1. Acceptance of Terms</h2>
            <p>By accessing and using Rentra, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#0F172A]">2. Description of Service</h2>
            <p>Rentra provides a platform connecting heavy machinery owners with customers who wish to rent equipment. Rentra acts as a marketplace and escrow agent but does not own the equipment listed.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#0F172A]">3. Registration and Accounts</h2>
            <p>To use certain features of the service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#0F172A]">4. Escrow and Payments</h2>
            <p>Customers must pay a 20% security deposit which is held in escrow by Rentra. This deposit is fully refundable if the booking is cancelled before approval. Once approved, the deposit is subject to the owner's cancellation policy.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#0F172A]">5. Liability</h2>
            <p>Rentra shall not be liable for any damages, injuries, or losses incurred during the rental period. All liabilities remain between the equipment owner and the renting customer.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
