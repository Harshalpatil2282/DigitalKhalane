/**
 * Donations Controller
 */

const Donation = require('../models/Donation');
const { Parser } = require('json2csv');

const createDonation = async (req, res, next) => {
  try {
    const donation = await Donation.create(req.body);
    res.status(201).json({ success: true, message: 'Thank you for your donation! 🙏', donation });
  } catch (error) { next(error); }
};

const getDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({}).sort({ createdAt: -1 });
    const total = donations.reduce((sum, d) => sum + d.amount, 0);
    res.json({ success: true, total, donations });
  } catch (error) { next(error); }
};

const exportDonationsCSV = async (req, res, next) => {
  try {
    const donations = await Donation.find({});
    const data = donations.map(d => ({
      Name: d.name, Email: d.email, Phone: d.phone || '-',
      Amount: d.amount, Village: d.village || '-',
      Method: d.paymentMethod, TransactionId: d.transactionId || '-',
      Message: d.message || '-', Status: d.status,
      Date: new Date(d.createdAt).toLocaleString(),
    }));
    const parser = new Parser();
    const csv = parser.parse(data);
    res.header('Content-Type', 'text/csv');
    res.attachment('donations.csv');
    res.send(csv);
  } catch (error) { next(error); }
};

module.exports = { createDonation, getDonations, exportDonationsCSV };
