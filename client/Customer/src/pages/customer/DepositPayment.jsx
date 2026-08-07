import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiCreditCard,
  FiSmartphone,
  FiGlobe,
  FiShield,
  FiCheckCircle,
  FiLock,
  FiDollarSign,
} from 'react-icons/fi';
import { useCustomer } from '../../context/CustomerContext';
import Button from '../../components/common/Button';

const DepositPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { draftBooking, bookings, confirmDepositPayment } = useCustomer();

  const booking = draftBooking || bookings.find((b) => b.id === id) || {
    id: id || 'BK-94825',
    equipmentName: 'Caterpillar CAT 320 Hydraulic Excavator',
    deposit: 2000,
    totalValue: 13100,
  };

  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'Card' | 'NetBanking' | 'Wallet'
  const [upiId, setUpiId] = useState('alex.morgan@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 9821');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('884');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [selectedWallet, setSelectedWallet] = useState('Paytm Wallet');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayDeposit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    let methodString = paymentMethod;
    if (paymentMethod === 'UPI') methodString = `UPI (${upiId})`;
    else if (paymentMethod === 'Card') methodString = `Card (${cardNumber.slice(-4)})`;
    else if (paymentMethod === 'NetBanking') methodString = `Net Banking (${selectedBank})`;
    else if (paymentMethod === 'Wallet') methodString = `Wallet (${selectedWallet})`;

    setTimeout(() => {
      confirmDepositPayment(booking.id, methodString);
      setIsProcessing(false);
      navigate('/customer/payment-success', {
        state: {
          bookingId: booking.id,
          equipmentName: booking.equipmentName,
          depositPaid: booking.deposit,
        },
      });
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/customer/booking-summary/${booking.id}`)}
          className="p-2.5 rounded-[12px] bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
        >
          <FiArrowLeft className="text-lg" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">Security Deposit Payment</h1>
          <p className="text-xs text-[#64748B] mt-0.5">Pay refundable security deposit to send booking request to asset owner.</p>
        </div>
      </div>

      <form onSubmit={handlePayDeposit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Payment Options */}
        <div className="lg:col-span-2 space-y-6">
          <div className="panel-card p-6 space-y-5">
            <h3 className="text-sm font-extrabold text-[#0F172A] border-b border-[#E2E8F0] pb-3">
              Select Payment Method
            </h3>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3 rounded-[14px] border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'UPI'
                    ? 'border-[#CCCCFF] bg-[#CCCCFF]/30 text-[#0F172A] font-bold shadow-xs'
                    : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] hover:bg-[#E2E8F0]'
                }`}
              >
                <FiSmartphone className="text-lg text-[#3B82F6]" />
                <span className="text-xs">UPI</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`p-3 rounded-[14px] border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'Card'
                    ? 'border-[#CCCCFF] bg-[#CCCCFF]/30 text-[#0F172A] font-bold shadow-xs'
                    : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] hover:bg-[#E2E8F0]'
                }`}
              >
                <FiCreditCard className="text-lg text-[#22C55E]" />
                <span className="text-xs">Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('NetBanking')}
                className={`p-3 rounded-[14px] border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'NetBanking'
                    ? 'border-[#CCCCFF] bg-[#CCCCFF]/30 text-[#0F172A] font-bold shadow-xs'
                    : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] hover:bg-[#E2E8F0]'
                }`}
              >
                <FiGlobe className="text-lg text-[#8B5CF6]" />
                <span className="text-xs">Net Banking</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Wallet')}
                className={`p-3 rounded-[14px] border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'Wallet'
                    ? 'border-[#CCCCFF] bg-[#CCCCFF]/30 text-[#0F172A] font-bold shadow-xs'
                    : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] hover:bg-[#E2E8F0]'
                }`}
              >
                <FiLock className="text-lg text-[#F59E0B]" />
                <span className="text-xs">Wallet</span>
              </button>

              <button
                type="button"
                disabled
                className="p-3 rounded-[14px] border border-[#E2E8F0] bg-slate-50 text-slate-300 text-center opacity-60 flex flex-col items-center gap-1.5 cursor-not-allowed"
              >
                <FiShield className="text-lg" />
                <span className="text-xs">EMI</span>
              </button>
            </div>

            {/* Sub-form based on selection */}
            <div className="pt-3 border-t border-[#E2E8F0]">
              {paymentMethod === 'UPI' && (
                <div className="space-y-3">
                  <label className="form-label">Enter UPI ID (Google Pay / PhonePe / Paytm / BHIM)</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                    className="form-input"
                    placeholder="username@okaxis"
                  />
                  <p className="text-[11px] text-[#64748B]">A payment request will be sent to your UPI app.</p>
                </div>
              )}

              {paymentMethod === 'Card' && (
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Cardholder Name & Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        required
                        className="form-input"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="form-label">CVV Code</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        required
                        className="form-input"
                        placeholder="•••"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'NetBanking' && (
                <div className="space-y-3">
                  <label className="form-label">Select Your Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="form-input cursor-pointer"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Wells Fargo">Wells Fargo</option>
                  </select>
                </div>
              )}

              {paymentMethod === 'Wallet' && (
                <div className="space-y-3">
                  <label className="form-label">Select Wallet</label>
                  <select
                    value={selectedWallet}
                    onChange={(e) => setSelectedWallet(e.target.value)}
                    className="form-input cursor-pointer"
                  >
                    <option value="Paytm Wallet">Paytm Wallet</option>
                    <option value="Amazon Pay">Amazon Pay</option>
                    <option value="Apple Pay">Apple Pay</option>
                    <option value="PhonePe Wallet">PhonePe Wallet</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Payment Summary & Submit CTA */}
        <div className="space-y-6">
          <div className="panel-card p-6 space-y-4 border-2 border-[#CCCCFF]">
            <h3 className="text-base font-extrabold text-[#0F172A]">Deposit Summary</h3>

            <div className="p-4 bg-[#F8FAFC] rounded-[18px] border border-[#E2E8F0] space-y-2 text-xs">
              <div className="flex justify-between text-[#64748B]">
                <span>Booking Reference:</span>
                <span className="font-mono font-bold text-[#0F172A]">{booking.id}</span>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>Equipment Unit:</span>
                <span className="font-bold text-[#0F172A] line-clamp-1">{booking.equipmentName}</span>
              </div>
            </div>

            <div className="p-4 bg-[#22C55E]/15 rounded-[18px] border border-[#22C55E]/30 text-center">
              <p className="text-xs font-bold text-[#64748B]">Paying Security Deposit Now</p>
              <p className="text-3xl font-extrabold text-[#0F172A] mt-0.5">
                ₹{booking.deposit.toLocaleString()}
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isProcessing}
              className="w-full shadow-md"
              icon={FiCheckCircle}
            >
              Pay Security Deposit (₹{booking.deposit.toLocaleString()})
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#64748B] text-center pt-2">
              <FiShield className="text-[#22C55E] text-xs shrink-0" />
              <span>256-Bit SSL Encrypted Escrow Account</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DepositPayment;
