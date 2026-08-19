const Rating = require('../models/Rating');
const MenuItem = require('../models/MenuItem');

// @desc    Add rating and review for a menu item
// @route   POST /api/ratings
// @access  Private
const createRating = async (req, res) => {
  try {
    const { menuItemId, rating, comment, orderId } = req.body;

    if (!menuItemId || !rating) {
      return res.status(400).json({ message: 'Menu item and rating are required' });
    }

    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const newRating = new Rating({
      user: req.user._id,
      menuItem: menuItemId,
      order: orderId || null,
      rating: Number(rating),
      comment: comment || '',
    });

    await newRating.save();

    // Recalculate average rating for menuItem
    const allRatings = await Rating.find({ menuItem: menuItemId });
    const avgRating = allRatings.reduce((acc, item) => acc + item.rating, 0) / allRatings.length;

    menuItem.rating = Math.round(avgRating * 10) / 10;
    menuItem.numReviews = allRatings.length;
    await menuItem.save();

    const populatedRating = await Rating.findById(newRating._id)
      .populate('user', 'name');

    res.status(201).json(populatedRating);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this item' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get ratings for a menu item
// @route   GET /api/menu/:id/ratings
// @access  Public
const getItemRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ menuItem: req.params.id })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all ratings (Admin)
// @route   GET /api/admin/reviews
// @access  Private/Admin
const getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({})
      .populate('user', 'name email')
      .populate('menuItem', 'name image price')
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a review (Admin)
// @route   DELETE /api/ratings/:id
// @access  Private/Admin
const deleteRating = async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    const menuItemId = rating.menuItem;
    await Rating.deleteOne({ _id: req.params.id });

    // Recalculate average rating for menuItem
    const allRatings = await Rating.find({ menuItem: menuItemId });
    const menuItem = await MenuItem.findById(menuItemId);

    if (menuItem) {
      if (allRatings.length > 0) {
        const avgRating = allRatings.reduce((acc, item) => acc + item.rating, 0) / allRatings.length;
        menuItem.rating = Math.round(avgRating * 10) / 10;
        menuItem.numReviews = allRatings.length;
      } else {
        menuItem.rating = 4.5;
        menuItem.numReviews = 0;
      }
      await menuItem.save();
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRating,
  getItemRatings,
  getAllRatings,
  deleteRating,
};
