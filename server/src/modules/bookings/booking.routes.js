const express = require('express');
const router = express.Router();
const { readLocalDB, writeLocalDB } = require('../../config/db');
const { authenticateToken } = require('../../middleware/auth.middleware');

router.get('/', authenticateToken, (req, res) => {
  const db = readLocalDB();
  res.json(db.bookings);
});

router.post('/', authenticateToken, (req, res) => {
  try {
    const { equipmentId, startDate, endDate, includeOperator, distanceKm, siteAddress, notes } = req.body;
    const db = readLocalDB();
    const equip = db.equipment.find((e) => e.id === equipmentId);

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

    const newBooking = {
      id: `BK-${Math.floor(10000 + Math.random() * 90000)}`,
      equipmentId,
      equipmentName: equip.name,
      customerId: req.user.id,
      startDate,
      endDate,
      durationDays,
      includeOperator,
      distanceKm,
      haulingFee,
      rentalCost,
      deposit,
      platformFee,
      gst,
      totalValue,
      status: 'Pending Owner Approval',
      siteAddress,
      notes,
    };

    db.bookings.push(newBooking);
    writeLocalDB(db);
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create booking', details: err.message });
  }
});

router.put('/:id/status', authenticateToken, (req, res) => {
  try {
    const { status } = req.body;
    const db = readLocalDB();
    const booking = db.bookings.find((b) => b.id === req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking reference not found' });
    booking.status = status;
    writeLocalDB(db);
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status', details: err.message });
  }
});

router.post('/:id/inspection', authenticateToken, (req, res) => {
  try {
    const { signatureDataUrl, loggedEngineHours } = req.body;
    const db = readLocalDB();
    const booking = db.bookings.find((b) => b.id === req.params.id);
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

    writeLocalDB(db);
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to record inspection', details: err.message });
  }
});

router.get('/:id/contract-pdf', authenticateToken, (req, res) => {
  const db = readLocalDB();
  const booking = db.bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking contract reference not found' });

  const pdfBuffer = Buffer.from(
    `%PDF-1.4\n1 0 obj\n<< /Title (RENTRA HEAVY MACHINERY RENTAL AGREEMENT CONTRACT) /BookingID (${booking.id}) /GrandTotal (${booking.totalValue}) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF`
  );
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=Rentra_Contract_${booking.id}.pdf`);
  res.send(pdfBuffer);
});

module.exports = router;
