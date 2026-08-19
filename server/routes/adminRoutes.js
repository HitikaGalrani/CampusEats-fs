const express = require('express');
const router = express.Router();
const { getDashboardStats, getUsersList } = require('../controllers/adminController');
const { getAllOrders } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/orders', getAllOrders);
router.get('/users', getUsersList);

module.exports = router;
