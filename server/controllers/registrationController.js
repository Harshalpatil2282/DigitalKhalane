/**
 * Registrations Controller
 */

const Registration = require('../models/Registration');
const { Parser } = require('json2csv');

// @desc   Register for an event
// @route  POST /api/registrations
const createRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.create(req.body);
    res.status(201).json({ success: true, message: 'Registration successful! 🎉', registration });
  } catch (error) { next(error); }
};

// @desc   Get all registrations (admin)
// @route  GET /api/registrations
const getRegistrations = async (req, res, next) => {
  try {
    const { event, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (event) filter.event = event;

    const registrations = await Registration.find(filter)
      .populate('event', 'title date')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Registration.countDocuments(filter);
    res.json({ success: true, total, registrations });
  } catch (error) { next(error); }
};

// @desc   Export registrations as CSV (admin)
// @route  GET /api/registrations/export
const exportCSV = async (req, res, next) => {
  try {
    const registrations = await Registration.find({}).populate('event', 'title date');
    const data = registrations.map(r => ({
      Name: r.name,
      Phone: r.phone,
      Email: r.email,
      Village: r.village || '-',
      Age: r.age || '-',
      Gender: r.gender,
      Event: r.event?.title || '-',
      'Event Date': r.event?.date ? new Date(r.event.date).toLocaleDateString() : '-',
      Status: r.status,
      'Registered At': new Date(r.createdAt).toLocaleString(),
    }));

    const parser = new Parser();
    const csv = parser.parse(data);
    res.header('Content-Type', 'text/csv');
    res.attachment('registrations.csv');
    res.send(csv);
  } catch (error) { next(error); }
};

// @desc   Delete registration (admin)
// @route  DELETE /api/registrations/:id
const deleteRegistration = async (req, res, next) => {
  try {
    await Registration.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Registration deleted' });
  } catch (error) { next(error); }
};

module.exports = { createRegistration, getRegistrations, exportCSV, deleteRegistration };
