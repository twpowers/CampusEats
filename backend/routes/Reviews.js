const express  = require('express');
const Review    = require('../models/Reviews');
const Restaurant = require('../models/Restaurant');
const User      = require('../models/Users');   
const router   = express.Router();

router.get('/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review
      .find({ restaurant: req.params.id })
      .populate('user', 'name')  
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error('Get reviews error', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.post('/:id/reviews', async (req, res) => {
  try {
    const { userId, rating, comment } = req.body;

    if (!userId || !rating) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const [rest, user] = await Promise.all([
      Restaurant.findById(req.params.id),
      User.findById(userId),
    ]);
    if (!rest || !user) return res.status(404).json({ error: 'Not found' });

    const review = await Review.create({
      restaurant: req.params.id,
      user: userId,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (err) {
    console.error('Create review error', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;