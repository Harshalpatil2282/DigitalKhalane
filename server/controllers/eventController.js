/**
 * Events Controller
 */

const Event = require('../models/Event');
const path = require('path');
const fs = require('fs');

// @desc   Get all events (public - active only)
// @route  GET /api/events
const getEvents = async (req, res, next) => {
  try {
    const { category, search, featured, page = 1, limit = 20 } = req.query;
    const filter = { isActive: true };

    if (category && category !== 'all') filter.category = category;
    if (featured === 'true') filter.isFeatured = true;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const events = await Event.find(filter)
      .sort({ date: 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Event.countDocuments(filter);
    res.json({ success: true, total, page: parseInt(page), events });
  } catch (error) { next(error); }
};

// @desc   Get ALL events including inactive (admin only)
// @route  GET /api/events/all
const getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.find({}).sort({ date: 1 });
    res.json({ success: true, total: events.length, events });
  } catch (error) { next(error); }
};

// @desc   Get single event
// @route  GET /api/events/:id
const getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, event });
  } catch (error) { next(error); }
};

// @desc   Create event (admin)
// @route  POST /api/events
const createEvent = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    // Parse tags if sent as JSON string
    if (typeof data.tags === 'string') {
      try { data.tags = JSON.parse(data.tags); } catch { data.tags = data.tags.split(',').map(t => t.trim()).filter(Boolean); }
    }
    // Parse booleans
    if (data.isFeatured !== undefined) data.isFeatured = data.isFeatured === 'true' || data.isFeatured === true;
    if (data.registrationRequired !== undefined) data.registrationRequired = data.registrationRequired === 'true' || data.registrationRequired === true;
    const event = await Event.create(data);
    res.status(201).json({ success: true, message: 'Event created successfully', event });
  } catch (error) { next(error); }
};

// @desc   Update event (admin)
// @route  PUT /api/events/:id
const updateEvent = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.image = `/uploads/${req.file.filename}`;
      const old = await Event.findById(req.params.id);
      if (old?.image) {
        const oldPath = path.join(__dirname, '../', old.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }
    // Parse tags if sent as JSON string
    if (typeof data.tags === 'string') {
      try { data.tags = JSON.parse(data.tags); } catch { data.tags = data.tags.split(',').map(t => t.trim()).filter(Boolean); }
    }
    // Parse booleans
    if (data.isFeatured !== undefined) data.isFeatured = data.isFeatured === 'true' || data.isFeatured === true;
    if (data.registrationRequired !== undefined) data.registrationRequired = data.registrationRequired === 'true' || data.registrationRequired === true;
    const event = await Event.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, message: 'Event updated', event });
  } catch (error) { next(error); }
};

// @desc   Delete event (admin)
// @route  DELETE /api/events/:id
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (event.image) {
      const imgPath = path.join(__dirname, '../', event.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    await event.deleteOne();
    res.json({ success: true, message: 'Event deleted' });
  } catch (error) { next(error); }
};

module.exports = { getEvents, getAllEvents, getEvent, createEvent, updateEvent, deleteEvent };
