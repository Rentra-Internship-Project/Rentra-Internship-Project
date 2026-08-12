const Equipment = require('../models/equipment.model');

exports.getAllEquipment = async (req, res) => {
  try {
    const filter = {};
    if (req.query.hasOperator === 'true') {
      filter.operatorAvailable = true;
    }
    const results = await Equipment.find(filter).populate('ownerId', 'name company phone email');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch equipment', details: err.message });
  }
};

exports.getBundles = (req, res) => {
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
};

exports.getEquipmentById = async (req, res) => {
  try {
    const unit = await Equipment.findById(req.params.id).populate('ownerId', 'name company phone email');
    if (!unit) return res.status(404).json({ error: 'Equipment unit not found' });
    res.json(unit);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch equipment unit', details: err.message });
  }
};

exports.createEquipment = async (req, res) => {
  try {
    const newUnit = await Equipment.create({
      ...req.body,
      ownerId: req.user.id,
    });
    res.status(201).json(newUnit);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create listing', details: err.message });
  }
};

exports.updateEquipment = async (req, res) => {
  try {
    const updated = await Equipment.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Equipment not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update equipment', details: err.message });
  }
};

exports.deleteEquipment = async (req, res) => {
  try {
    const deleted = await Equipment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Equipment not found' });
    res.json({ message: 'Equipment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete equipment', details: err.message });
  }
};
