import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const Privacy = () => {
  useDocumentTitle('Privacy Policy', 'Understand how Rentra collects, protects, and handles user data, KYB verification documents, and payment details.');

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-[24px] shadow-sm border border-[#E2E8F0] p-8 sm:p-12">
        <Link to="/" className="inline-flex items-center text-sm font-semibold text-[#64748B] hover:text-[#0F172A] mb-8 transition-colors">
          <FiArrowLeft className="mr-2" /> Back to Home
        </Link>
        <h1 className="text-3xl font-extrabold text-[#0F172A] mb-6">Privacy Policy</h1>
        <p className="text-sm text-[#64748B] mb-8">Last updated: August 2026</p>
        
        <div className="prose prose-sm sm:prose-base text-[#475569] space-y-6">
          <section>
            <h2 className="text-lg font-bold text-[#0F172A]">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This includes names, emails, phone numbers, and payment information.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#0F172A]">2. Use of Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, such as to facilitate payments, send receipts, provide products and services you request, develop new features, and provide customer support.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#0F172A]">3. Sharing of Information</h2>
            <p>We may share your information with equipment owners (if you are a customer) or customers (if you are an owner) to facilitate the rental transaction. We do not sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#0F172A]">4. Security</h2>
            <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
