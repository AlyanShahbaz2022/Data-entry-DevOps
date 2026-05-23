const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');

const router = express.Router();

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const handleError = (err, res) => {
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: messages.join(', ') });
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: 'A user with this email already exists' });
  }
  return res.status(500).json({ error: err.message || 'Server error' });
};

// GET /api/users - list all users (newest first)
router.get('/', async (_req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    handleError(err, res);
  }
});

// GET /api/users/:id - get one user
router.get('/:id', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    handleError(err, res);
  }
});

// POST /api/users - create a user
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, dob } = req.body;
    const user = await User.create({ name, email, phone, dob });
    res.status(201).json(user);
  } catch (err) {
    handleError(err, res);
  }
});

// PUT /api/users/:id - update a user
router.put('/:id', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }
    const { name, email, phone, dob } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, dob },
      { new: true, runValidators: true, context: 'query' }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    handleError(err, res);
  }
});

// DELETE /api/users/:id - delete a user
router.delete('/:id', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted', id: user._id });
  } catch (err) {
    handleError(err, res);
  }
});

module.exports = router;
