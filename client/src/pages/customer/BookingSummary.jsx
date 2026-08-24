import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  FiArrowLeft,
  FiMapPin,
  FiArrowRight,
  FiInfo,
  FiTruck,
  FiUserCheck,
} from 'react-icons/fi';
import { useCustomer } from '../../context/CustomerContext';
import Button from '../../components/common/Button';

const BookingSummary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { equipmentList, createBooking, isLoading } = useCustomer();

  const equipment = equipmentList.find((e) => e.id === id) || equipmentList.find((e) => e._id === id);

  const getTodayStr = () => new Date().toISOString().split('T')[0];
  const getTomorrowStr = (baseDateStr) => {
    const d = baseDateStr ? new Date(baseDateStr) : new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  // Dates & Form State
  const [startDate, setStartDate] = useState(getTodayStr());
  const [endDate, setEndDate] = useState(getTomorrowStr());
  const [siteAddress, setSiteAddress] = useState('104 Industrial Parkway, Site B, Austin TX');
  const [notes, setNotes] = useState('Gate passcode 4821. Operator certification attached.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleStartDateChange = (newStart) => {
    setErrorMsg('');
    const today = getTodayStr();
    if (newStart < today) {
      setErrorMsg('Rental start date cannot be in the past.');
      setStartDate(today);
      if (endDate < today) {
        setEndDate(getTomorrowStr(today));
      }
      return;
    }
    setStartDate(newStart);
    if (endDate <= newStart) {
      setEndDate(getTomorrowStr(newStart));
    }
  };

  const handleEndDateChange = (newEnd) => {
    setErrorMsg('');
    if (newEnd < startDate) {
      setErrorMsg('Rental end date cannot be earlier than start date.');
      setEndDate(startDate);
      return;
    }
    setEndDate(newEnd);
  };

  // Fallback while loading
  if (!equipment) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        {isLoading ? (
          <div className="w-10 h-10 border-4 border-[#CCCCFF] border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-[#0F172A] mb-2">Equipment Not Found</h2>
            <p className="text-[#64748B] mb-6">The equipment you are looking for does not exist or has been removed.</p>
            <Button onClick={() => navigate('/customer/dashboard')}>Back to Dashboard</Button>
          </>
        )}
      </div>
    );
  }

  // Extract navigation state from EquipmentDetails & Fleet Bundler
  const { includeOperator, operatorDailyRate: stateOperatorRate } = location.state || {};
  const operatorDailyRate = stateOperatorRate || equipment.operatorDailyRate || 1500;
  const isBundle = location.state?.isBundle || false;
  const bundleName = location.state?.bundleName || '';
  const discountPercent = location.state?.discountPercent || 0;

  // Financial calculations
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end - start;
  const durationDays = diffTime <= 0 ? 1 : Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const baseDailyRate = equipment.pricePerDay;
  const operatorCostPerDay = includeOperator ? operatorDailyRate : 0;
  
  const baseRentalCost = durationDays * baseDailyRate;
  const operatorTotalCost = durationDays * operatorCostPerDay;
  const subtotalBeforeDiscount = baseRentalCost + operatorTotalCost;

  const bundleDiscountAmount = isBundle ? Math.round(subtotalBeforeDiscount * (discountPercent / 100)) : 0;
  const rentalCost = subtotalBeforeDiscount - bundleDiscountAmount;


  const platformFeePercent = equipment.platformFeeRate !== undefined ? equipment.platformFeeRate : 2;
  const platformFee = Math.round(rentalCost * (platformFeePercent / 100));
  const gst = Math.round((rentalCost + platformFee) * 0.18);
  const totalValue = rentalCost + platformFee + gst;
  const deposit = Math.round(totalValue * 0.20); // Advance payment (20% of total)
  const amountPayableNow = deposit;

  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const today = getTodayStr();
    if (startDate < today) {
      setErrorMsg('Rental start date cannot be in the past.');
      return;
    }

    if (endDate < startDate) {
      setErrorMsg('Rental end date cannot be earlier than start date.');
      return;
    }

    setIsSubmitting(true);

    const res = await createBooking({
      equipmentId: equipment.id || equipment._id,
      startDate,
      endDate,
      siteAddress,
      notes,
    });

    if (res.success) {
      navigate(`/customer/bookings`);
    } else {
      setErrorMsg(res.error || 'Failed to submit booking request.');
      setIsSubmitting(false);
    }
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
                <FiMapPin className="text-[#3B82F6]" /> {equipment.location || equipment.locationAddress} • Owner: <span className="font-semibold text-[#0F172A]">{equipment.owner?.name || equipment.ownerId?.name || 'Owner'}</span>
              </p>
            </div>
          </div>
          
          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-[12px] text-sm">
              {errorMsg}
            </div>
          )}

          {/* Dates & Location Form */}
          <div className="panel-card p-6 space-y-4">
            <h3 className="text-sm font-extrabold text-[#0F172A] border-b border-[#E2E8F0] pb-3">
              Rental Schedule & Job Site Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">Rental Start Date</label>
                <input
                  type="date"
                  min={getTodayStr()}
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-[10px] text-sm text-[#0F172A] focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">Rental End Date</label>
                <input
                  type="date"
                  min={startDate || getTodayStr()}
                  value={endDate}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-[10px] text-sm text-[#0F172A] focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#64748B] mb-1">Job Site Delivery Address</label>
                <input
                  type="text"
                  value={siteAddress}
                  onChange={(e) => setSiteAddress(e.target.value)}
                  required
                  placeholder="Street, City, PIN Code"
                  className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-[10px] text-sm text-[#0F172A] focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#64748B] mb-1">Special Instructions (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any access restrictions, specific times..."
                  className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-[10px] text-sm text-[#0F172A] focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 min-h-[80px]"
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
                  <td className="py-2.5 text-[#64748B]">Base Machinery ({durationDays} days @ ₹{baseDailyRate.toLocaleString()}/day)</td>
                  <td className="py-2.5 text-right font-extrabold text-[#0F172A]">₹{baseRentalCost.toLocaleString()}</td>
                </tr>

                {includeOperator && (
                  <tr className="bg-emerald-50/50">
                    <td className="py-2.5 text-emerald-800 font-semibold flex items-center gap-1">
                      <FiUserCheck className="text-emerald-600 shrink-0" /> Professional Assistance ({durationDays} days @ ₹{operatorCostPerDay.toLocaleString()}/day)
                    </td>
                    <td className="py-2.5 text-right font-extrabold text-emerald-800">+₹{operatorTotalCost.toLocaleString()}</td>
                  </tr>
                )}

                {isBundle && (
                  <tr className="bg-purple-50/70">
                    <td className="py-2.5 text-purple-900 font-bold flex items-center gap-1">
                      🏷️ Fleet Package Discount ({discountPercent}% Off {bundleName})
                    </td>
                    <td className="py-2.5 text-right font-extrabold text-purple-700">-₹{bundleDiscountAmount.toLocaleString()}</td>
                  </tr>
                )}


                <tr>
                  <td className="py-2.5 text-[#64748B]">Platform Marketplace Fee ({platformFeePercent}%)</td>
                  <td className="py-2.5 text-right font-extrabold text-[#0F172A]">₹{platformFee.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-[#64748B]">GST (Tax 18%)</td>
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
                <span className="text-xs font-bold px-2 py-0.5 bg-[#22C55E] text-white rounded-full">Advance Payment (20%)</span>
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
              variant="custom"
              size="lg"
              className="w-full bg-[#4C1D95] hover:bg-[#2E1065] text-white shadow-lg shadow-violet-900/30 transition-colors"
              icon={FiArrowRight}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BookingSummary;
