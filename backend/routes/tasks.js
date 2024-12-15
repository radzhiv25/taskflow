const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// CRUD Routes
router.get('/', authenticateToken, async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.json(tasks);
});

router.post('/', authenticateToken, async (req, res) => {
  const { title, description, status } = req.body;
  const newTask = new Task({ title, description, status, user: req.user.id });
  await newTask.save();
  res.status(201).json(newTask);
});

router.put('/:id', authenticateToken, async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true }
  );
  if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
  res.json(updatedTask);
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json({ message: 'Task deleted successfully' });
});

module.exports = router;