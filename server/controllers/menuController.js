const MenuItem = require('../models/MenuItem');

// @desc    Get all menu items with search, filter, sort
// @route   GET /api/menu
// @access  Public
const getMenuItems = async (req, res) => {
  try {
    const { search, category, sort, availableOnly } = req.query;

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (availableOnly === 'true') {
      query.isAvailable = true;
    }

    let sortOptions = {};
    if (sort === 'price-asc') sortOptions.price = 1;
    else if (sort === 'price-desc') sortOptions.price = -1;
    else if (sort === 'rating-desc') sortOptions.rating = -1;
    else sortOptions.createdAt = -1; // Default newest

    const items = await MenuItem.find(query)
      .populate('category', 'name icon')
      .sort(sortOptions);

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single menu item by ID
// @route   GET /api/menu/:id
// @access  Public
const getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate('category', 'name icon');
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create menu item (Admin)
// @route   POST /api/menu
// @access  Private/Admin
const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, image, category, isAvailable, isSpecial } = req.body;

    const item = new MenuItem({
      name,
      description,
      price,
      image: image || undefined,
      category,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      isSpecial: isSpecial || false,
    });

    const createdItem = await item.save();
    const populatedItem = await MenuItem.findById(createdItem._id).populate('category', 'name icon');
    res.status(201).json(populatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update menu item (Admin)
// @route   PUT /api/menu/:id
// @access  Private/Admin
const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const { name, description, price, image, category, isAvailable, isSpecial } = req.body;

    item.name = name !== undefined ? name : item.name;
    item.description = description !== undefined ? description : item.description;
    item.price = price !== undefined ? price : item.price;
    item.image = image !== undefined ? image : item.image;
    item.category = category !== undefined ? category : item.category;
    item.isAvailable = isAvailable !== undefined ? isAvailable : item.isAvailable;
    item.isSpecial = isSpecial !== undefined ? isSpecial : item.isSpecial;

    const updatedItem = await item.save();
    const populatedItem = await MenuItem.findById(updatedItem._id).populate('category', 'name icon');
    res.json(populatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete menu item (Admin)
// @route   DELETE /api/menu/:id
// @access  Private/Admin
const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    await MenuItem.deleteOne({ _id: req.params.id });
    res.json({ message: 'Menu item removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle food item availability (Admin)
// @route   PATCH /api/menu/:id/toggle-availability
// @access  Private/Admin
const toggleAvailability = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    item.isAvailable = !item.isAvailable;
    await item.save();

    res.json({ _id: item._id, isAvailable: item.isAvailable, name: item.name });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
};
