const express = require('express');
const router = express.Router();
const { readLocalDB, writeLocalDB } = require('../../config/db');
const { authenticateToken } = require('../../middleware/auth.middleware');

router.get('/', (req, res) => {
  const db = readLocalDB();
  let results = db.equipment;
  if (req.query.hasOperator === 'true') {
    results = results.filter((e) => e.operatorAvailable);
  }
  res.json(results);
});

router.get('/bundles', (req, res) => {
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

router.get('/:id', (req, res) => {
  const db = readLocalDB();
  const unit = db.equipment.find((e) => e.id === req.params.id);
  if (!unit) return res.status(404).json({ error: 'Equipment unit not found' });
  res.json(unit);
});

router.post('/', authenticateToken, (req, res) => {
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

module.exports = router;
