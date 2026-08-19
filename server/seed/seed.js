const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const Rating = require('../models/Rating');
const Notification = require('../models/Notification');

dotenv.config({ path: '../.env' });

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campuseats';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB...');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await MenuItem.deleteMany({});
    await Order.deleteMany({});
    await Rating.deleteMany({});
    await Notification.deleteMany({});

    console.log('[Seed] Cleared database...');

    // Create Users
    const adminUser = await User.create({
      name: 'Campus Canteen Admin',
      email: 'admin@campuseats.edu',
      password: 'admin123',
      phone: '+91 98765 43210',
      role: 'ADMIN',
    });

    const student1 = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@college.edu',
      password: 'student123',
      phone: '+91 91234 56789',
      role: 'USER',
    });

    const student2 = await User.create({
      name: 'Priya Verma',
      email: 'priya@college.edu',
      password: 'student123',
      phone: '+91 92345 67890',
      role: 'USER',
    });

    const student3 = await User.create({
      name: 'Amit Patel',
      email: 'amit@college.edu',
      password: 'student123',
      phone: '+91 93456 78901',
      role: 'USER',
    });

    console.log('[Seed] Created users (1 Admin, 3 Students)...');

    // Create Categories
    const categoriesData = [
      { name: 'Breakfast', description: 'Crispy dosas, hot teas & morning bites', icon: 'coffee' },
      { name: 'Lunch', description: 'Filling rolls, meals & burgers', icon: 'utensils' },
      { name: 'Snacks', description: 'Crispy samosas, fries & quick bites', icon: 'cookie' },
      { name: 'Beverages', description: 'Refreshing cold coffee, shakes & teas', icon: 'cup-soda' },
      { name: 'Desserts', description: 'Sweet treats & ice creams', icon: 'ice-cream' },
    ];

    const categories = await Category.insertMany(categoriesData);
    const categoryMap = {};
    categories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    console.log('[Seed] Created 5 categories...');

    // Create 10 Menu Items with Indian college canteen pricing
    const menuItemsData = [
      {
        name: 'Veg Burger',
        description: 'Crispy potato patty with fresh lettuce, tomatoes, and house mayo in a toasted bun.',
        price: 80,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
        category: categoryMap['Lunch'],
        isAvailable: true,
        rating: 4.6,
        numReviews: 14,
        isSpecial: true,
      },
      {
        name: 'Cheese Pizza',
        description: 'Personal 8-inch thin crust pizza topped with rich mozzarella cheese & oregano seasoning.',
        price: 120,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
        category: categoryMap['Lunch'],
        isAvailable: true,
        rating: 4.8,
        numReviews: 22,
        isSpecial: true,
      },
      {
        name: 'Masala Dosa',
        description: 'Golden crispy rice crepe filled with spiced potato masala, served with coconut chutney and sambar.',
        price: 70,
        image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80',
        category: categoryMap['Breakfast'],
        isAvailable: true,
        rating: 4.7,
        numReviews: 18,
        isSpecial: true,
      },
      {
        name: 'Paneer Roll',
        description: 'Spiced paneer tikka wrapped in a buttery whole-wheat paratha with mint chutney & onions.',
        price: 90,
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
        category: categoryMap['Lunch'],
        isAvailable: true,
        rating: 4.5,
        numReviews: 9,
      },
      {
        name: 'French Fries',
        description: 'Deep-fried golden potato strips sprinkled with peri peri seasoning and served with ketchup.',
        price: 60,
        image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80',
        category: categoryMap['Snacks'],
        isAvailable: true,
        rating: 4.3,
        numReviews: 11,
      },
      {
        name: 'Cold Coffee',
        description: 'Creamy blended iced coffee topped with chocolate syrup and a hint of vanilla.',
        price: 70,
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80',
        category: categoryMap['Beverages'],
        isAvailable: true,
        rating: 4.9,
        numReviews: 31,
        isSpecial: true,
      },
      {
        name: 'Masala Tea',
        description: 'Freshly brewed aromatic Indian milk tea spiced with cardamom, ginger and cinnamon.',
        price: 25,
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
        category: categoryMap['Beverages'],
        isAvailable: true,
        rating: 4.9,
        numReviews: 45,
      },
      {
        name: 'Samosa',
        description: 'Golden crispy triangular pastry stuffed with spiced potatoes & peas (2 pcs).',
        price: 20,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
        category: categoryMap['Snacks'],
        isAvailable: true,
        rating: 4.6,
        numReviews: 28,
      },
      {
        name: 'Veg Sandwich',
        description: 'Grilled double-decker sandwich with cucumber, tomato, potato, cheese slice, and green chutney.',
        price: 60,
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
        category: categoryMap['Breakfast'],
        isAvailable: true,
        rating: 4.4,
        numReviews: 12,
      },
      {
        name: 'Chocolate Shake',
        description: 'Rich thick dark chocolate milkshake topped with chocolate chips and whipped cream.',
        price: 90,
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80',
        category: categoryMap['Beverages'],
        isAvailable: false, // Sample SOLD OUT item
        rating: 4.7,
        numReviews: 15,
      },
    ];

    const menuItems = await MenuItem.insertMany(menuItemsData);
    console.log('[Seed] Created 10 menu items...');

    // Create 5 Sample Orders with different statuses
    const ordersData = [
      {
        user: student1._id,
        items: [
          { menuItem: menuItems[0]._id, name: menuItems[0].name, price: menuItems[0].price, quantity: 1, image: menuItems[0].image },
          { menuItem: menuItems[5]._id, name: menuItems[5].name, price: menuItems[5].price, quantity: 1, image: menuItems[5].image },
        ],
        totalAmount: 150,
        pickupLocation: 'Main Canteen Counter A',
        specialInstructions: 'Extra chocolate syrup in coffee please!',
        status: 'PREPARING',
        paymentMethod: 'Pay at Canteen',
        estimatedTime: '10 mins',
      },
      {
        user: student2._id,
        items: [
          { menuItem: menuItems[1]._id, name: menuItems[1].name, price: menuItems[1].price, quantity: 1, image: menuItems[1].image },
          { menuItem: menuItems[4]._id, name: menuItems[4].name, price: menuItems[4].price, quantity: 1, image: menuItems[4].image },
        ],
        totalAmount: 180,
        pickupLocation: 'Library Block Canteen',
        specialInstructions: 'Make fries extra crispy.',
        status: 'READY',
        paymentMethod: 'Pay at Canteen',
        estimatedTime: 'Ready now',
      },
      {
        user: student3._id,
        items: [
          { menuItem: menuItems[2]._id, name: menuItems[2].name, price: menuItems[2].price, quantity: 2, image: menuItems[2].image },
          { menuItem: menuItems[6]._id, name: menuItems[6].name, price: menuItems[6].price, quantity: 2, image: menuItems[6].image },
        ],
        totalAmount: 190,
        pickupLocation: 'Science Block Canteen',
        specialInstructions: 'Less sugar in tea.',
        status: 'PLACED',
        paymentMethod: 'Pay at Canteen',
        estimatedTime: '15 mins',
      },
      {
        user: student1._id,
        items: [
          { menuItem: menuItems[3]._id, name: menuItems[3].name, price: menuItems[3].price, quantity: 1, image: menuItems[3].image },
        ],
        totalAmount: 90,
        pickupLocation: 'Main Canteen Counter A',
        specialInstructions: '',
        status: 'COMPLETED',
        paymentMethod: 'Pay at Canteen',
        paymentStatus: 'PAID',
        estimatedTime: 'Completed',
      },
      {
        user: student2._id,
        items: [
          { menuItem: menuItems[7]._id, name: menuItems[7].name, price: menuItems[7].price, quantity: 2, image: menuItems[7].image },
          { menuItem: menuItems[6]._id, name: menuItems[6].name, price: menuItems[6].price, quantity: 1, image: menuItems[6].image },
        ],
        totalAmount: 65,
        pickupLocation: 'Main Canteen Counter B',
        specialInstructions: '',
        status: 'CONFIRMED',
        paymentMethod: 'Pay at Canteen',
        estimatedTime: '12 mins',
      },
    ];

    const orders = await Order.insertMany(ordersData);
    console.log('[Seed] Created 5 sample orders...');

    // Create Sample Ratings
    await Rating.create({
      user: student1._id,
      menuItem: menuItems[0]._id,
      order: orders[3]._id,
      rating: 5,
      comment: 'Best burger on campus! Perfectly crispy patty and hot soft buns.',
    });

    await Rating.create({
      user: student2._id,
      menuItem: menuItems[5]._id,
      rating: 5,
      comment: 'Super refreshing cold coffee during hot afternoon lectures!',
    });

    console.log('[Seed] Created sample ratings...');

    // Create Sample Notifications
    await Notification.create({
      user: student1._id,
      title: 'Order Status Update',
      message: 'Your order is currently PREPARING in the kitchen.',
      type: 'ORDER_STATUS',
      orderId: orders[0]._id,
    });

    await Notification.create({
      user: student2._id,
      title: '🎉 Order Ready!',
      message: 'Your Cheese Pizza & Fries are ready for pickup at Library Block Canteen!',
      type: 'ORDER_STATUS',
      orderId: orders[1]._id,
    });

    console.log('[Seed] Created sample notifications...');
    console.log('==================================================');
    console.log('SEEDING COMPLETED SUCCESSFULLY!');
    console.log('Admin Account: admin@campuseats.edu / admin123');
    console.log('Student Accounts: rahul@college.edu / student123, priya@college.edu / student123');
    console.log('==================================================');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
