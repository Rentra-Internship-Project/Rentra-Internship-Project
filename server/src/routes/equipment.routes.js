const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipment.controller');
const { authenticateToken, optionalAuth } = require('../middleware/auth.middleware');

const requireOwner = (req, res, next) => {
  if (!req.user || req.user.role !== 'OWNER') {
    return res.status(403).json({ error: 'Owner access required to list equipment' });
  }
  next();
};

// Public routes — no auth needed
router.get('/', equipmentController.getAllEquipment);
router.get('/bundles', equipmentController.getBundles);

// Owner: get own equipment (all statuses)
router.get('/my', authenticateToken, requireOwner, equipmentController.getMyEquipment);

// Public / Owner: get single equipment (with status check inside controller)
router.get('/:id', optionalAuth, equipmentController.getEquipmentById);

// Public: get reviews for equipment
router.get('/:id/reviews', equipmentController.getEquipmentReviews);

// Owner: create, update, delete
router.post('/', authenticateToken, requireOwner, equipmentController.createEquipment);
router.put('/:id', authenticateToken, requireOwner, equipmentController.updateEquipment);
router.delete('/:id', authenticateToken, equipmentController.deleteEquipment);

module.exports = router;
