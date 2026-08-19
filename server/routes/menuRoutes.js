const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
} = require('../controllers/menuController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .get(getMenuItems)
  .post(protect, adminOnly, createMenuItem);

router.route('/:id')
  .get(getMenuItemById)
  .put(protect, adminOnly, updateMenuItem)
  .delete(protect, adminOnly, deleteMenuItem);

router.patch('/:id/toggle-availability', protect, adminOnly, toggleAvailability);

module.exports = router;
