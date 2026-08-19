const express = require('express');
const router = express.Router();
const {
  createRating,
  getItemRatings,
  getAllRatings,
  deleteRating,
} = require('../controllers/ratingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, createRating);
router.get('/menu/:id', getItemRatings);
router.get('/admin/all', protect, adminOnly, getAllRatings);
router.delete('/:id', protect, adminOnly, deleteRating);

module.exports = router;
