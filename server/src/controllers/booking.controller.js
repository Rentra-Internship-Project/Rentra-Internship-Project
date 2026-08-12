const Booking = require('../models/booking.model');
const Equipment = require('../models/equipment.model');

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate('customerId', 'name email avatar');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings', details: err.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const { equipmentId, startDate, endDate, includeOperator, distanceKm, siteAddress, notes } = req.body;
    
    const equip = await Equipment.findById(equipmentId).catch(() => null);

    if (!equip) return res.status(404).json({ error: 'Equipment not found' });

    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));

    const baseRate = equip.pricePerDay;
    const operatorDailyRate = includeOperator ? equip.operatorDailyRate || 1500 : 0;
    const rentalCost = (baseRate + operatorDailyRate) * durationDays;

    const haulingFee = Math.round(150 + (Number(distanceKm || 25) * 3.50));
    const deposit = Math.round(rentalCost * 0.20);
    const platformFee = Math.round(rentalCost * 0.02);
    const gst = Math.round((rentalCost + haulingFee + platformFee) * 0.088);
    const totalValue = rentalCost + haulingFee + deposit + platformFee + gst;

    const newBooking = await Booking.create({
      equipmentId,
      equipmentName: equip.name,
      customerId: req.user.id,
      startDate,
      endDate,
      durationDays,
      dailyRate: baseRate,
      includeOperator,
      distanceKm,
      haulingFee,
      rentalCost,
      deposit,
      platformFee,
      gst,
      totalValue,
      amountPaidNow: deposit,
      remainingBalance: totalValue - deposit,
      status: 'Pending Owner Approval',
      siteAddress,
      notes,
    });

    const io = req.app.get('io');
    if (io) {
      io.to(`user_${equip.ownerId}`).emit('notification', {
        title: 'New Booking Request',
        message: `You have a new request for ${equip.name}`,
        bookingId: newBooking._id,
        timestamp: new Date().toISOString()
      });
    }

    res.status(201).json(newBooking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create booking', details: err.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: 'Booking reference not found' });

    const io = req.app.get('io');
    if (io) {
      io.to(`user_${booking.customerId}`).emit('notification', {
        title: 'Booking Updated',
        message: `Your booking for ${booking.equipmentName} is now: ${status}`,
        bookingId: booking._id,
        timestamp: new Date().toISOString()
      });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status', details: err.message });
  }
};

exports.recordInspection = async (req, res) => {
  try {
    const { signatureDataUrl, loggedEngineHours } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const maxAllowed = booking.durationDays * 8;
    const overtimeHours = Math.max(0, Number(loggedEngineHours) - maxAllowed);
    const overtimeSurcharge = overtimeHours * 45;

    booking.signatureDataUrl = signatureDataUrl;
    booking.loggedEngineHours = Number(loggedEngineHours);
    booking.overtimeHours = overtimeHours;
    booking.overtimeSurcharge = overtimeSurcharge;
    booking.totalValue += overtimeSurcharge;
    booking.status = 'Returned & Inspected';

    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to record inspection', details: err.message });
  }
};

exports.generateContractPdf = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking contract reference not found' });

    const pdfBuffer = Buffer.from(
      `%PDF-1.4\n1 0 obj\n<< /Title (RENTRA HEAVY MACHINERY RENTAL AGREEMENT CONTRACT) /BookingID (${booking._id}) /GrandTotal (${booking.totalValue}) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF`
    );
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Rentra_Contract_${booking._id}.pdf`);
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate contract', details: err.message });
  }
};
