const Business = require('../models/business.model');
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
        timestamp: notif.createdAt,
      });
    }
  } catch (err) {
    console.error('Failed to create notification:', err.message);
  }
}

// Owner registers their own business
exports.registerBusiness = async (req, res) => {
  try {
    // Only owners can register a business
    if (req.user.role !== 'OWNER') {
      return res.status(403).json({ error: 'Only owners can register a business' });
    }

    // Check if business already exists for this owner
    const existing = await Business.findOne({ ownerId: req.user.id });
    if (existing) {
      // If rejected, allow resubmission
      if (existing.status === 'Rejected') {
        const {
          businessName, ownerName, businessType, registrationNumber,
          taxId, gstNumber, insurancePolicyNumber, address, city, state,
          phone, email, description, documents,
          aadharNumber, panNumber, bankAccountNumber, ifscCode, upiId
        } = req.body;

        existing.businessName = businessName || existing.businessName;
        existing.ownerName = ownerName || existing.ownerName;
        existing.businessType = businessType || existing.businessType;
        existing.registrationNumber = registrationNumber || existing.registrationNumber;
        existing.taxId = taxId || existing.taxId;
        existing.gstNumber = gstNumber || existing.gstNumber;
        existing.insurancePolicyNumber = insurancePolicyNumber || existing.insurancePolicyNumber;
        existing.address = address || existing.address;
        existing.city = city || existing.city;
        existing.state = state || existing.state;
        existing.phone = phone || existing.phone;
        existing.email = email || existing.email;
        existing.description = description || existing.description;
        existing.aadharNumber = aadharNumber || existing.aadharNumber;
        existing.panNumber = panNumber || existing.panNumber;
        existing.bankAccountNumber = bankAccountNumber || existing.bankAccountNumber;
        existing.ifscCode = ifscCode || existing.ifscCode;
        existing.upiId = upiId || existing.upiId;
        if (documents) existing.documents = documents;
        // Reset to pending on resubmission
        existing.status = 'Pending';
        existing.rejectionReason = '';
        await existing.save();

        await createNotification(req.app.get('io'), req.user.id, {
          title: 'Business Resubmitted',
          message: 'Your business profile has been resubmitted and is pending admin review.',
          type: 'BusinessSubmitted',
        });

        return res.json({ business: existing, message: 'Business resubmitted for review' });
      }
      return res.status(400).json({
        error: 'You already have a business registered',
        business: existing,
      });
    }

    const {
      businessName, ownerName, businessType, registrationNumber,
      taxId, gstNumber, insurancePolicyNumber, address, city, state,
      phone, email, description, documents,
      aadharNumber, panNumber, bankAccountNumber, ifscCode, upiId
    } = req.body;

    if (!businessName || !ownerName) {
      return res.status(400).json({ error: 'Business name and owner name are required' });
    }

    const newBusiness = await Business.create({
      ownerId: req.user.id, // Always from JWT — cannot be spoofed
      businessName,
      ownerName,
      businessType: businessType || '',
      registrationNumber: registrationNumber || '',
      taxId: taxId || '',
      gstNumber: gstNumber || '',
      insurancePolicyNumber: insurancePolicyNumber || '',
      address: address || '',
      city: city || '',
      state: state || '',
      phone: phone || '',
      email: email || '',
      description: description || '',
      aadharNumber: aadharNumber || '',
      panNumber: panNumber || '',
      bankAccountNumber: bankAccountNumber || '',
      ifscCode: ifscCode || '',
      upiId: upiId || '',
      documents: documents || [],
      status: 'Pending',
    });

    await createNotification(req.app.get('io'), req.user.id, {
      title: 'Business Submitted',
      message: 'Your business profile has been submitted successfully and is pending admin review.',
      type: 'BusinessSubmitted',
    });

    res.status(201).json({
      business: newBusiness,
      message: 'Business registration submitted. Pending admin review.',
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to register business', details: err.message });
  }
};

// Get current owner's business
exports.getMyBusiness = async (req, res) => {
  try {
    const business = await Business.findOne({ ownerId: req.user.id });
    if (!business) {
      return res.json({ business: null });
    }
    res.json({ business });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch business', details: err.message });
  }
};

// Update current owner's business (only allowed if Rejected — resubmit)
exports.updateMyBusiness = async (req, res) => {
  try {
    const business = await Business.findOne({ ownerId: req.user.id });
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    const allowedFields = [
      'businessName', 'ownerName', 'businessType', 'registrationNumber',
      'taxId', 'gstNumber', 'insurancePolicyNumber', 'address', 'city',
      'state', 'phone', 'email', 'description', 'documents',
      'aadharNumber', 'panNumber', 'bankAccountNumber', 'ifscCode', 'upiId'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        business[field] = req.body[field];
      }
    });

    // If rejected, resubmission resets to Pending
    if (business.status === 'Rejected') {
      business.status = 'Pending';
      business.rejectionReason = '';
    }

    await business.save();
    res.json({ business, message: 'Business updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update business', details: err.message });
  }
};
