let ioInstance = null;

const initSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Join admin room for admin dashboard real-time updates
    socket.on('join_admin', () => {
      socket.join('admin');
      console.log(`[Socket.IO] Socket ${socket.id} joined room 'admin'`);
    });

    // Join user room for targeted notifications
    socket.on('join_user', (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
        console.log(`[Socket.IO] Socket ${socket.id} joined room 'user_${userId}'`);
      }
    });

    // Join order room for specific live tracking page updates
    socket.on('join_order', (orderId) => {
      if (orderId) {
        socket.join(`order_${orderId}`);
        console.log(`[Socket.IO] Socket ${socket.id} joined room 'order_${orderId}'`);
      }
    });

    // Leave order room
    socket.on('leave_order', (orderId) => {
      if (orderId) {
        socket.leave(`order_${orderId}`);
        console.log(`[Socket.IO] Socket ${socket.id} left room 'order_${orderId}'`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });
};

const getIO = () => {
  if (!ioInstance) {
    throw new Error('Socket.io instance not initialized!');
  }
  return ioInstance;
};

// Emit new order to admin dashboard
const notifyAdminNewOrder = (order) => {
  if (ioInstance) {
    ioInstance.to('admin').emit('newOrder', order);
    console.log(`[Socket.IO] Emitted 'newOrder' to room 'admin' for Order ID: ${order._id}`);
  }
};

// Emit order status update to student tracking page & user room
const notifyOrderStatusUpdate = (order) => {
  if (ioInstance) {
    const payload = {
      orderId: order._id,
      status: order.status,
      updatedAt: order.updatedAt,
      estimatedTime: order.estimatedTime,
      order,
    };
    ioInstance.to(`order_${order._id}`).emit('orderStatusUpdated', payload);
    ioInstance.to(`user_${order.user}`).emit('orderStatusUpdated', payload);

    if (order.status === 'READY') {
      ioInstance.to(`order_${order._id}`).emit('orderReady', {
        message: '🎉 Your order is ready for pickup!',
        orderId: order._id,
      });
      ioInstance.to(`user_${order.user}`).emit('notification', {
        title: 'Food Ready!',
        message: `Order #${order._id.toString().slice(-6)} is ready for pickup at ${order.pickupLocation}`,
        type: 'ORDER_STATUS',
        orderId: order._id,
      });
    }

    console.log(`[Socket.IO] Emitted status update (${order.status}) for Order ID: ${order._id}`);
  }
};

module.exports = {
  initSocket,
  getIO,
  notifyAdminNewOrder,
  notifyOrderStatusUpdate,
};
