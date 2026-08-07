import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiCalendar,
  FiMapPin,
  FiShield,
  FiDollarSign,
  FiCheckCircle,
  FiArrowRight,
  FiInfo,
} from 'react-icons/fi';
import { useCustomer } from '../../context/CustomerContext';
import Button from '../../components/common/Button';

const BookingSummary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { equipmentList, prepareBookingSummary } = useCustomer();

  const equipment = equipmentList.find((e) => e.id === id) || equipmentList[0];

  // Dates & Form State
  const [startDate, setStartDate] = useState('2026-08-12');
  const [endDate, setEndDate] = useState('2026-08-14');
  const [siteAddress, setSiteAddress] = useState('104 Industrial Parkway, Site B, Austin TX');
  const [notes, setNotes] = useState('Gate passcode 4821. Operator certification attached.');

  // Financial calculations
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const durationDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const dailyRate = equipment.pricePerDay; // e.g. ₹5,000
  const rentalCost = durationDays * dailyRate; // e.g. ₹10,000
  const deposit = 2000; // Security deposit
  const platformFee = Math.round(rentalCost * 0.02); // e.g. ₹200
  const gst = Math.round((rentalCost + platformFee) * 0.088); // e.g. ₹900
  const totalValue = rentalCost + deposit + platformFee + gst; // e.g. ₹13,100
  const amountPayableNow = deposit; // Security Deposit ₹2,000

  const handleProceedToPayment = (e) => {
    e.preventDefault();

    const summary = prepareBookingSummary({
      equipmentId: equipment.id,
      equipmentName: equipment.name,
      category: equipment.category,
      image: equipment.image,
      ownerName: equipment.owner.name,
      ownerContact: equipment.owner.phone,
      ownerEmail: equipment.owner.email,
      ownerAvatar: equipment.owner.avatar,
      startDate,
      endDate,
      durationDays,
      dailyRate,
      rentalCost,
      deposit,
      platformFee,
      gst,
      totalValue,
      amountPaidNow: amountPayableNow,
      remainingBalance: totalValue - amountPayableNow,
      siteAddress,
      notes,
    });

    navigate(`/customer/payment/${summary.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/customer/equipment/${equipment.id}`)}
          className="p-2.5 rounded-[12px] bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
        >
          <FiArrowLeft className="text-lg" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">Rental Booking Summary</h1>
          <p className="text-xs text-[#64748B] mt-0.5">Review rental breakdown and proceed to security deposit payment.</p>
        </div>
      </div>

      {/* Main Form & Financial Grid */}
      <form onSubmit={handleProceedToPayment} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Equipment & Date Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Equipment Info Header */}
          <div className="panel-card p-5 flex items-start gap-4">
            <img
              src={equipment.image}
              alt={equipment.name}
              className="w-20 h-20 rounded-[16px] object-cover border border-[#E2E8F0] shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="px-2.5 py-0.5 bg-[#CCCCFF]/40 text-[#0F172A] text-[10px] font-bold rounded-full">
                {equipment.category}
              </span>
              <h3 className="text-base font-extrabold text-[#0F172A] mt-1 line-clamp-1">{equipment.name}</h3>
              <p className="text-xs text-[#64748B] flex items-center gap-1 mt-0.5">
                <FiMapPin className="text-[#3B82F6]" /> {equipment.location} • Owner: <span className="font-semibold text-[#0F172A]">{equipment.owner.name}</span>
              </p>
            </div>
          </div>

          {/* Dates & Location Form */}
          <div className="panel-card p-6 space-y-4">
            <h3 className="text-sm font-extrabold text-[#0F172A] border-b border-[#E2E8F0] pb-3">
              Rental Schedule & Job Site Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Rental Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Rental End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="form-label">Job Site Delivery Address</label>
                <input
                  type="text"
                  value={siteAddress}
                  onChange={(e) => setSiteAddress(e.target.value)}
                  required
                  className="form-input"
                  placeholder="Enter full street address for equipment delivery..."
                />
              </div>

              <div className="sm:col-span-2">
                <label className="form-label">Operator Instructions & Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="form-input resize-none"
                  placeholder="Any site gate pass codes, contact phone numbers..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Summary Table */}
        <div className="space-y-6">
          <div className="panel-card p-6 space-y-5 border-2 border-[#CCCCFF]">
            <h3 className="text-base font-extrabold text-[#0F172A] border-b border-[#E2E8F0] pb-3">
              Financial Breakdown
            </h3>

            <table className="w-full text-xs">
              <tbody className="divide-y divide-[#E2E8F0]">
                <tr>
                  <td className="py-2.5 text-[#64748B]">Rental Cost ({durationDays} days @ ₹{dailyRate.toLocaleString()}/day)</td>
                  <td className="py-2.5 text-right font-extrabold text-[#0F172A]">₹{rentalCost.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-[#64748B]">Security Deposit (Refundable)</td>
                  <td className="py-2.5 text-right font-extrabold text-[#0F172A]">₹{deposit.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-[#64748B]">Platform Fee</td>
                  <td className="py-2.5 text-right font-extrabold text-[#0F172A]">₹{platformFee.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-[#64748B]">GST (Tax)</td>
                  <td className="py-2.5 text-right font-extrabold text-[#0F172A]">₹{gst.toLocaleString()}</td>
                </tr>
                <tr className="bg-[#F8FAFC]">
                  <td className="py-3 px-2 font-bold text-[#0F172A] text-sm">Total Booking Value</td>
                  <td className="py-3 px-2 text-right font-extrabold text-[#0F172A] text-base">₹{totalValue.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            {/* Pay Now Highlight Box */}
            <div className="p-4 bg-[#CCCCFF]/30 rounded-[18px] border border-[#CCCCFF] space-y-1">
              <div className="flex items-center justify-between text-xs text-[#64748B]">
                <span className="font-bold text-[#0F172A]">Amount Payable Now:</span>
                <span className="text-xs font-bold px-2 py-0.5 bg-[#22C55E] text-white rounded-full">Security Deposit</span>
              </div>
              <p className="text-2xl font-extrabold text-[#0F172A]">
                ₹{amountPayableNow.toLocaleString()}
              </p>
              <p className="text-[11px] text-[#64748B] flex items-center gap-1 pt-1">
                <FiInfo className="text-[#3B82F6] text-xs shrink-0" />
                Remaining ₹{(totalValue - amountPayableNow).toLocaleString()} will be paid after owner approval.
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full shadow-md"
              icon={FiArrowRight}
            >
              Proceed to Deposit Payment
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BookingSummary;
