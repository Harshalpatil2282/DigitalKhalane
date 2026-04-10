/**
 * Stats Controller - Admin Dashboard Data
 */

const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Announcement = require('../models/Announcement');
const Gallery = require('../models/Gallery');
const Donation = require('../models/Donation');
const Contact = require('../models/Contact');

const getStats = async (req, res, next) => {
  try {
    const [
      totalEvents, totalRegistrations, totalAnnouncements,
      totalGallery, donations, unreadContacts,
      recentRegistrations, recentDonations,
    ] = await Promise.all([
      Event.countDocuments({ isActive: true }),
      Registration.countDocuments(),
      Announcement.countDocuments({ isActive: true }),
      Gallery.countDocuments(),
      Donation.find({ status: 'completed' }),
      Contact.countDocuments({ isRead: false }),
      Registration.find().populate('event', 'title').sort({ createdAt: -1 }).limit(5),
      Donation.find().sort({ createdAt: -1 }).limit(5),
    ]);

    const totalDonationAmount = donations.reduce((sum, d) => sum + d.amount, 0);

    res.json({
      success: true,
      stats: {
        totalEvents,
        totalRegistrations,
        totalAnnouncements,
        totalGallery,
        totalDonationAmount,
        totalDonors: donations.length,
        unreadContacts,
        recentRegistrations,
        recentDonations,
      },
    });
  } catch (error) { next(error); }
};

module.exports = { getStats };
