import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Contact = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-[24px] shadow-sm border border-[#E2E8F0] p-8 sm:p-12">
        <Link to="/" className="inline-flex items-center text-sm font-semibold text-[#64748B] hover:text-[#0F172A] mb-8 transition-colors">
          <FiArrowLeft className="mr-2" /> Back to Home
        </Link>
        <h1 className="text-3xl font-extrabold text-[#0F172A] mb-6">Contact Us</h1>
        <p className="text-sm text-[#64748B] mb-8">We'd love to hear from you. Please reach out if you have any questions or concerns.</p>
        
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#CCCCFF]/20 flex items-center justify-center flex-shrink-0">
              <FiMail className="w-6 h-6 text-[#5D5DEB]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0F172A]">Email Support</h3>
              <p className="text-[#475569] mt-1">For general queries and escrow disputes:</p>
              <a href="mailto:support@rentra.com" className="text-[#5D5DEB] font-semibold hover:underline">support@rentra.com</a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#CCCCFF]/20 flex items-center justify-center flex-shrink-0">
              <FiPhone className="w-6 h-6 text-[#5D5DEB]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0F172A]">Phone Support</h3>
              <p className="text-[#475569] mt-1">Available Mon-Fri, 9am - 6pm (IST):</p>
              <a href="tel:+9118001234567" className="text-[#5D5DEB] font-semibold hover:underline">+91 1800-123-4567</a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#CCCCFF]/20 flex items-center justify-center flex-shrink-0">
              <FiMapPin className="w-6 h-6 text-[#5D5DEB]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0F172A]">Headquarters</h3>
              <p className="text-[#475569] mt-1">Rentra Technology Pvt Ltd<br/>Kalyani Nagar, Pune<br/>Maharashtra 411014, India</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
