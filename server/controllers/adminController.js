const Order = require('../models/Order');
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Today's Orders count
    const todaysOrdersCount = await Order.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    // Today's Revenue sum
    const todaysOrders = await Order.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: 'CANCELLED' },
    });
    const todaysRevenue = todaysOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Total lifetime revenue
    const allCompletedOrders = await Order.find({ status: { $ne: 'CANCELLED' } });
    const totalRevenue = allCompletedOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Counts by status
    const pendingOrdersCount = await Order.countDocuments({ status: { $in: ['PLACED', 'CONFIRMED'] } });
    const preparingOrdersCount = await Order.countDocuments({ status: 'PREPARING' });
    const readyOrdersCount = await Order.countDocuments({ status: 'READY' });
    const completedOrdersCount = await Order.countDocuments({ status: 'COMPLETED' });

    // Recent orders
    const recentOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Total counts
    const totalMenuItemsCount = await MenuItem.countDocuments({});
    const totalUsersCount = await User.countDocuments({ role: 'USER' });

    res.json({
      todaysOrdersCount,
      todaysRevenue,
      totalRevenue,
      pendingOrdersCount,
      preparingOrdersCount,
      readyOrdersCount,
      completedOrdersCount,
      totalMenuItemsCount,
      totalUsersCount,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users list (Admin)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsersList = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getUsersList,
};
