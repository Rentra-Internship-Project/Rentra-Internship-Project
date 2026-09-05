const Equipment = require('../models/equipment.model');
const Business = require('../models/business.model');
const Booking = require('../models/booking.model');
const Notification = require('../models/notification.model');

// Helper: create and emit a notification
async function createNotification(io, userId, data) {
  try {
    const notif = await Notification.create({ userId, ...data });
    if (io) {
      io.to(`user_${userId}`).emit('notification', {
        id: notif._id,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        bookingId: notif.bookingId,
        timestamp: notif.createdAt,
      });
    }
  } catch (err) {
    console.error('Failed to create notification:', err.message);
  }
}

// PUBLIC: Get all Approved, Available equipment
exports.getAllEquipment = async (req, res) => {
  try {
    const filter = {
      status: 'Approved',
    };

    // Optional availability filter (default to Available)
    if (req.query.availability) {
      filter.availability = req.query.availability;
    } else {
      filter.availability = 'Available';
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.hasOperator === 'true') {
      filter.operatorAvailable = true;
    }

    // High-performance text search
    if (req.query.q) {
      filter.$text = { $search: req.query.q };
    }

    const results = await Equipment.find(filter)
      .populate('ownerId', 'name phone email')
      .populate('businessId', 'businessName city state')
      .sort({ createdAt: -1 });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch equipment', details: err.message });
  }
};

// PUBLIC (with status check): Get one equipment by ID
exports.getEquipmentById = async (req, res) => {
  try {
    const unit = await Equipment.findById(req.params.id)
      .populate('ownerId', 'name phone email avatar')
      .populate('businessId', 'businessName city state businessType');

    if (!unit) return res.status(404).json({ error: 'Equipment not found' });

    // If not Approved, only the owner (or admin) can view it
    if (unit.status !== 'Approved') {
      const requesterId = req.user?.id;
      const ownerIdStr = unit.ownerId?._id ? unit.ownerId._id.toString() : unit.ownerId?.toString();
      if (!requesterId || (ownerIdStr !== requesterId && req.user?.role !== 'ADMIN')) {
        return res.status(404).json({ error: 'Equipment not found' });
      }
    }

    res.json(unit);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch equipment', details: err.message });
  }
};

// OWNER: Get own equipment (all statuses)
exports.getMyEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find({ ownerId: req.user.id })
      .populate('businessId', 'businessName city state')
      .sort({ createdAt: -1 });
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your equipment', details: err.message });
  }
};

// OWNER: Create new equipment — requires Approved business
exports.createEquipment = async (req, res) => {
  try {
    // Check owner has an approved business
    const business = await Business.findOne({ ownerId: req.user.id });
    if (!business) {
      return res.status(403).json({
        error: 'Business not registered',
        message: 'You must register and get your business approved before listing equipment.',
      });
    }
    if (business.status !== 'Approved') {
      return res.status(403).json({
        error: `Business ${business.status}`,
        message: `Your business verification is ${business.status}. Equipment listing is only allowed after admin approval.`,
        businessStatus: business.status,
      });
    }

    const { name, category, description, locationAddress, pricePerDay, operatorAvailable, operatorDailyRate, weightTons, image, availability } = req.body;

    if (!name || !category || !description || !pricePerDay) {
      return res.status(400).json({ error: 'Name, category, description, and pricePerDay are required' });
    }

    const newUnit = await Equipment.create({
      ownerId: req.user.id,
      businessId: business._id,
      name,
      category,
      description,
      locationAddress: locationAddress || business.city || '',
      pricePerDay: Number(pricePerDay),
      operatorAvailable: operatorAvailable || false,
      operatorDailyRate: operatorDailyRate ? Number(operatorDailyRate) : 1500,
      weightTons: weightTons ? Number(weightTons) : 0,
      image: image || 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=800',
      availability: availability || 'Available',
      status: 'Pending Approval', // Always pending until admin approves
    });

    // Notify admin (we can't easily notify a specific admin, so we store in DB)
    // In production, emit to all admin rooms or use a queue
    const io = req.app.get('io');
    await createNotification(io, req.user.id, {
      title: 'Equipment Submitted',
      message: `Your equipment "${name}" has been submitted for admin review.`,
      type: 'General',
      equipmentId: newUnit._id,
    });

    res.status(201).json({
      equipment: newUnit,
      message: 'Equipment submitted for admin approval. It will be publicly visible once approved.',
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create listing', details: err.message });
  }
};

// OWNER: Update own equipment
exports.updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) return res.status(404).json({ error: 'Equipment not found' });

    // Ownership check
    if (equipment.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You are not allowed to edit this equipment' });
    }

    const allowedFields = [
      'name', 'category', 'description', 'locationAddress',
      'pricePerDay', 'operatorAvailable', 'operatorDailyRate',
      'weightTons', 'image', 'availability'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        equipment[field] = req.body[field];
      }
    });

    // If owner edits a Rejected equipment, reset to Pending Approval for re-review
    if (equipment.status === 'Rejected') {
      equipment.status = 'Pending Approval';
      equipment.rejectionReason = '';
      equipment.approvedAt = null;
      equipment.approvedBy = null;
    }

    await equipment.save();
    res.json({ equipment, message: 'Equipment updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update equipment', details: err.message });
  }
};

// OWNER: Delete own equipment
exports.deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) return res.status(404).json({ error: 'Equipment not found' });

    // Ownership check
    if (equipment.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You are not allowed to delete this equipment' });
    }

    await Equipment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Equipment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete equipment', details: err.message });
  }
};

// Static bundles — non-business-critical feature
exports.getBundles = (req, res) => {
  res.json([
    {
      id: 'bundle-1',
      title: 'Building Foundation Package',
      machines: ['CAT 320 Excavator', 'CAT D6 Bulldozer'],
      discount: '10% OFF',
      discountPercent: 10,
      bundlePricePerDay: 8700,
    },
    {
      id: 'bundle-2',
      title: 'Road Construction Fleet',
      machines: ['CAT 320 Excavator', 'JCB 3CX Backhoe', 'Komatsu Dump Truck'],
      discount: '12% OFF',
      discountPercent: 12,
      bundlePricePerDay: 12500,
    },
  ]);
};

// PUBLIC: Get all reviews for a specific equipment
exports.getEquipmentReviews = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch bookings for this equipment that have a rating
    const bookings = await Booking.find({
      equipmentId: id,
      rating: { $gt: 0 },
    })
      .populate('customerId', 'name avatar')
      .sort({ updatedAt: -1 })
      .limit(50);

    const reviews = bookings.map((b) => ({
      id: b._id,
      userName: b.customerId?.name || 'Verified Customer',
      avatar:
        b.customerId?.avatar ||
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150',
      rating: b.rating,
      comment: b.review || '',
      date: new Date(b.updatedAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    }));

    // Also update equipment's aggregate rating & count
    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await Equipment.findByIdAndUpdate(id, {
        rating: Math.round(avgRating * 10) / 10,
        reviewsCount: reviews.length,
      });
    }

    res.json({ reviews, count: reviews.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews', details: err.message });
  }
};
