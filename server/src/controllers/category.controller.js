const Category = require('../models/category.model');
const Equipment = require('../models/equipment.model');

// Seed default categories if none exist
const DEFAULT_CATEGORIES = [
  { name: 'Earthmoving', icon: '🏗️', description: 'Excavators, bulldozers, graders' },
  { name: 'Material Handling', icon: '📦', description: 'Forklifts, reach stackers, conveyors' },
  { name: 'Road Construction', icon: '🛣️', description: 'Pavers, rollers, milling machines' },
  { name: 'Hauling', icon: '🚛', description: 'Dump trucks, tippers, trailers' },
  { name: 'Lifting Equipment', icon: '🏗️', description: 'Cranes, hoists, aerial platforms' },
  { name: 'Compaction', icon: '🔧', description: 'Compactors, rammers, plate compactors' },
  { name: 'Construction', icon: '🧱', description: 'Concrete mixers, boom pumps, batching plants' },
  { name: 'Agriculture', icon: '🌾', description: 'Tractors, harvesters, irrigation equipment' },
  { name: 'Industrial', icon: '🏭', description: 'Industrial machinery and equipment' },
  { name: 'Logistics', icon: '🚚', description: 'Warehouse equipment and logistics machines' },
  { name: 'Power & Energy', icon: '⚡', description: 'Generators, transformers, power equipment' },
  { name: 'Mining', icon: '⛏️', description: 'Drilling rigs, mining trucks, loaders' },
];

// Seed categories on startup if DB is empty
exports.seedDefaultCategories = async () => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      await Category.insertMany(DEFAULT_CATEGORIES);
      console.log('✅ Default categories seeded');
    }
  } catch (err) {
    console.error('Failed to seed categories:', err.message);
  }
};

// PUBLIC: Get all active categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories', details: err.message });
  }
};

// ADMIN: Create category
exports.createCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name is required' });

    const existing = await Category.findOne({ name });
    if (existing) return res.status(400).json({ error: 'Category already exists' });

    const category = await Category.create({ name, description, icon });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create category', details: err.message });
  }
};

// ADMIN: Update category
exports.updateCategory = async (req, res) => {
  try {
    const oldCategory = await Category.findById(req.params.id);
    if (!oldCategory) return res.status(404).json({ error: 'Category not found' });

    const newName = req.body.name;
    const isNameChanged = newName && newName !== oldCategory.name;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    // Sync the category name in all associated equipment if the name changed
    if (isNameChanged) {
      await Equipment.updateMany(
        { category: oldCategory.name },
        { $set: { category: category.name } }
      );
    }

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update category', details: err.message });
  }
};

// ADMIN: Soft delete category (set isActive = false)
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Category deactivated', category });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete category', details: err.message });
  }
};
