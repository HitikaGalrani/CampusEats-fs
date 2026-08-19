const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Notification = require('../models/Notification');
const { notifyAdminNewOrder, notifyOrderStatusUpdate } = require('../services/socketService');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { items, pickupLocation, specialInstructions, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    // Check item availability & calculate total
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const dbItem = await MenuItem.findById(item.menuItem);
      if (!dbItem) {
        return res.status(404).json({ message: `Menu item ${item.name} not found` });
      }
      if (!dbItem.isAvailable) {
        return res.status(400).json({ message: `Sorry, ${dbItem.name} is currently SOLD OUT` });
      }

      const itemTotal = dbItem.price * item.quantity;
      totalAmount += itemTotal;

      validatedItems.push({
        menuItem: dbItem._id,
        name: dbItem.name,
        price: dbItem.price,
        quantity: item.quantity,
        image: dbItem.image,
      });
    }

    const order = new Order({
      user: req.user._id,
      items: validatedItems,
      totalAmount,
      pickupLocation: pickupLocation || 'Main Canteen Counter',
      specialInstructions: specialInstructions || '',
      paymentMethod: paymentMethod || 'Pay at Canteen',
      status: 'PLACED',
      estimatedTime: '15-20 mins',
    });

    const createdOrder = await order.save();
    const populatedOrder = await Order.findById(createdOrder._id)
      .populate('user', 'name email phone');

    // Emit Socket.IO event to Admin room
    notifyAdminNewOrder(populatedOrder);

    // Save initial notification for user
    await Notification.create({
      user: req.user._id,
      title: 'Order Placed Successful!',
      message: `Your order #${createdOrder._id.toString().slice(-6)} has been received and sent to the kitchen.`,
      type: 'ORDER_STATUS',
      orderId: createdOrder._id,
    });

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status && status !== 'ALL') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check ownership or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status, estimatedTime } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const validStatuses = ['PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    order.status = status;
    if (estimatedTime) {
      order.estimatedTime = estimatedTime;
    }

    if (status === 'COMPLETED') {
      order.paymentStatus = 'PAID';
    }

    const updatedOrder = await order.save();

    // Create persistent notification for user
    let notificationTitle = `Order Status: ${status}`;
    let notificationMessage = `Your order #${order._id.toString().slice(-6)} is now ${status.toLowerCase()}.`;

    if (status === 'CONFIRMED') {
      notificationMessage = `Your order #${order._id.toString().slice(-6)} has been confirmed by the canteen!`;
    } else if (status === 'PREPARING') {
      notificationMessage = `The chef is preparing your fresh meal!`;
    } else if (status === 'READY') {
      notificationTitle = '🎉 Order Ready!';
      notificationMessage = `Your order #${order._id.toString().slice(-6)} is ready for pickup at ${order.pickupLocation}!`;
    } else if (status === 'COMPLETED') {
      notificationMessage = `Order completed. Thank you for dining with CampusEats!`;
    }

    await Notification.create({
      user: order.user,
      title: notificationTitle,
      message: notificationMessage,
      type: 'ORDER_STATUS',
      orderId: order._id,
    });

    // Emit Socket.IO event to student live tracker
    notifyOrderStatusUpdate(updatedOrder);

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
