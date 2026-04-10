/**
 * Announcements Controller
 */

const Announcement = require('../models/Announcement');

const getAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find({ isActive: true }).sort({ isPinned: -1, createdAt: -1 });
    res.json({ success: true, announcements });
  } catch (error) { next(error); }
};

const getAllAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find({}).sort({ createdAt: -1 });
    res.json({ success: true, announcements });
  } catch (error) { next(error); }
};

const createAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.create(req.body);
    res.status(201).json({ success: true, message: 'Announcement created', announcement });
  } catch (error) { next(error); }
};

const updateAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!announcement) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Announcement updated', announcement });
  } catch (error) { next(error); }
};

const deleteAnnouncement = async (req, res, next) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Announcement deleted' });
  } catch (error) { next(error); }
};

module.exports = { getAnnouncements, getAllAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement };
