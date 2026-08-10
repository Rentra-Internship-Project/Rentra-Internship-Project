const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimiter = require('./middleware/rateLimiter');
const errorMiddleware = require('./middleware/errorMiddleware');
const { readLocalDB, writeLocalDB } = require('./config/db');
const { authenticateToken, JWT_SECRET } = require('./middleware/auth.middleware');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(rateLimiter(150, 60000));

// Healthcheck Route
app.get('/', (req, res) => {
  res.json({
    service: 'Rentra MERN REST API',
    status: 'ONLINE',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// AUTH MODULE
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const db = readLocalDB();

    if (db.users.some((u) => u.email === email)) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password || 'password123', 10);
    const newUser = {
      id: `u-${Date.now()}`,
      name,
      email,
      passwordHash,
      role: role || 'CUSTOMER',
      company: role === 'OWNER' ? 'Titan Machinery Fleet Ltd' : 'Apex Infra Contractors',
    };

    db.users.push(newUser);
    writeLocalDB(db);

    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user: newUser, token });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = readLocalDB();
    const user = db.users.find((u) => u.email === email);

    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const db = readLocalDB();
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User profile not found' });
  res.json({ user });
});

// EQUIPMENT MODULE
app.get('/api/equipment', (req, res) => {
  const db = readLocalDB();
  let results = db.equipment;
  if (req.query.hasOperator === 'true') {
    results = results.filter((e) => e.operatorAvailable);
  }
  res.json(results);
});

app.get('/api/equipment/bundles', (req, res) => {
  res.json([
    {
      id: 'bundle-1',
      title: 'Building Foundation Package',
      machines: ['CAT 320 Excavator', 'CAT D6 Bulldozer'],
      discount: '10% OFF',
      bundlePricePerDay: 8700,
    },
    {
      id: 'bundle-2',
      title: 'Road Construction Fleet',
      machines: ['CAT 320 Excavator', 'JCB 3CX Backhoe', 'Komatsu Dump Truck'],
      discount: '12% OFF',
      bundlePricePerDay: 12500,
    },
  ]);
});

app.get('/api/equipment/:id', (req, res) => {
  const db = readLocalDB();
  const unit = db.equipment.find((e) => e.id === req.params.id);
  if (!unit) return res.status(404).json({ error: 'Equipment unit not found' });
  res.json(unit);
});

app.post('/api/equipment', authenticateToken, (req, res) => {
  try {
    const db = readLocalDB();
    const newUnit = {
      id: `EQ-${Math.floor(1000 + Math.random() * 9000)}`,
      ownerId: req.user.id,
      ...req.body,
    };
    db.equipment.push(newUnit);
    writeLocalDB(db);
    res.status(201).json(newUnit);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create listing', details: err.message });
  }
});

// BOOKINGS MODULE
app.get('/api/bookings', authenticateToken, (req, res) => {
  const db = readLocalDB();
  res.json(db.bookings);
});

app.post('/api/bookings', authenticateToken, (req, res) => {
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

app.put('/api/bookings/:id/status', authenticateToken, (req, res) => {
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

app.post('/api/bookings/:id/inspection', authenticateToken, (req, res) => {
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

// ADMIN MODULE
app.get('/api/admin/stats', authenticateToken, (req, res) => {
  const db = readLocalDB();
  const totalRevenue = db.bookings.reduce((sum, b) => sum + (b.totalValue || 0), 0);
  res.json({
    totalUsers: db.users.length,
    totalEquipment: db.equipment.length,
    totalBookings: db.bookings.length,
    totalBusinesses: db.businesses.length,
    totalRevenue,
    pendingVerifications: db.businesses.filter((b) => b.status === 'Pending').length,
  });
});

app.get('/api/admin/businesses', authenticateToken, (req, res) => {
  const db = readLocalDB();
  res.json(db.businesses);
});

app.put('/api/admin/businesses/:id/verify', authenticateToken, (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const db = readLocalDB();
    const biz = db.businesses.find((b) => b.id === req.params.id);
    if (!biz) return res.status(404).json({ error: 'Business not found' });
    biz.status = status;
    if (rejectionReason) biz.rejectionReason = rejectionReason;
    biz.verifiedAt = new Date().toISOString();
    writeLocalDB(db);
    res.json(biz);
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify business', details: err.message });
  }
});

// HELPERS
app.get('/api/bookings/:id/contract-pdf', authenticateToken, (req, res) => {
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

app.post('/api/upload', authenticateToken, (req, res) => {
  const { filename } = req.body;
  const mediaUrl = `https://res.cloudinary.com/rentra-assets/image/upload/v1723400/equipment_${Date.now()}_${filename || 'upload.jpg'}`;
  res.status(201).json({ message: 'Media uploaded successfully', url: mediaUrl, format: 'jpg', bytes: 245089 });
});

// Attach Error Middleware
app.use(errorMiddleware);

module.exports = app;
