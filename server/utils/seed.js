/**
 * Database Seed Script
 * Run: node utils/seed.js
 * Creates default admin user + sample events, announcements, gallery
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Event = require('../models/Event');
const Announcement = require('../models/Announcement');
const SiteContent = require('../models/SiteContent');

const connectDB = require('../config/db');

const seed = async () => {
  await connectDB();
  console.log('🌱 Starting seed...');

  // ── Admin User ────────────────────────────────────────────────────────────
  await User.deleteMany({});
  await User.create({
    name: 'Harshal Parmeshvar Patil',
    email: 'DigitalHarshal02@gmail.com',
    password: 'DigitalHarshal@2282',
    role: 'superadmin',
  });
  console.log('✅ Admin user created → DigitalHarshal02@gmail.com / DigitalHarshal@2282');

  // ── Events ────────────────────────────────────────────────────────────────
  await Event.deleteMany({});
  const events = await Event.insertMany([
    {
      title: 'Mangal Puja - Opening Ceremony',
      description: 'Grand opening puja ceremony with devotional songs and rituals at the main temple. All devotees are welcome to participate in the auspicious beginning of Khalane Yatra Utsav.',
      category: 'religious',
      date: new Date('2025-04-14T06:00:00+05:30'),
      time: '6:00 AM',
      endTime: '9:00 AM',
      location: 'Khalane Main Temple',
      isFeatured: true,
      registrationRequired: false,
      tags: ['puja', 'temple', 'opening'],
    },
    {
      title: 'Kirtan & Bhajan Sandhya',
      description: 'A soulful evening of devotional kirtan and bhajan sung by local artists and invited performers from across Maharashtra.',
      category: 'religious',
      date: new Date('2025-04-14T18:00:00+05:30'),
      time: '6:00 PM',
      endTime: '10:00 PM',
      location: 'Main Stage, Khalane Village Ground',
      isFeatured: true,
      registrationRequired: false,
      tags: ['kirtan', 'bhajan', 'music'],
    },
    {
      title: 'Tamasha & Folk Dance Performance',
      description: 'Enjoy the vibrant colors of traditional Maharashtrian Tamasha and folk dance by renowned troupes. A night of culture and entertainment!',
      category: 'cultural',
      date: new Date('2025-04-15T20:00:00+05:30'),
      time: '8:00 PM',
      endTime: '11:00 PM',
      location: 'Main Stage, Khalane Village Ground',
      isFeatured: true,
      tags: ['tamasha', 'folk', 'dance', 'culture'],
    },
    {
      title: 'Kabaddi Tournament',
      description: 'Annual inter-village kabaddi competition. Teams from 12 villages will compete for the Khalane Yatra Trophy.',
      category: 'sports',
      date: new Date('2025-04-15T09:00:00+05:30'),
      time: '9:00 AM',
      endTime: '5:00 PM',
      location: 'Sports Ground, Khalane',
      registrationRequired: true,
      maxParticipants: 200,
      tags: ['kabaddi', 'sports', 'tournament'],
    },
    {
      title: 'Grand Yatra Procession (Miravnuk)',
      description: 'The highlight of the festival — a magnificent procession with decorated palanquins, musicians, and thousands of devotees marching through the village.',
      category: 'procession',
      date: new Date('2025-04-16T08:00:00+05:30'),
      time: '8:00 AM',
      location: 'Starting from Main Temple → Village Circle → Back to Temple',
      isFeatured: true,
      tags: ['procession', 'yatra', 'miravnuk'],
    },
    {
      title: 'Traditional Food Mela',
      description: 'Taste authentic Maharashtrian cuisine — puran poli, kombdi vade, bhakri, and more. Stalls by village women self-help groups.',
      category: 'food',
      date: new Date('2025-04-15T12:00:00+05:30'),
      time: '12:00 PM',
      endTime: '9:00 PM',
      location: 'Village Square, Khalane',
      isFeatured: false,
      tags: ['food', 'mela', 'maharashtrian'],
    },
    {
      title: 'Drawing & Rangoli Competition',
      description: 'Open competition for children and youth. Prizes worth ₹10,000 to be won. Theme: Our Village, Our Pride.',
      category: 'competition',
      date: new Date('2025-04-15T10:00:00+05:30'),
      time: '10:00 AM',
      endTime: '1:00 PM',
      location: 'Primary School, Khalane',
      registrationRequired: true,
      maxParticipants: 150,
      tags: ['rangoli', 'drawing', 'competition', 'children'],
    },
    {
      title: 'Closing Ceremony & Prasad Distribution',
      description: 'Final puja, blessings, and Mahaprasad distribution to all attendees. A grand conclusion to the Khalane Yatra Utsav.',
      category: 'religious',
      date: new Date('2025-04-16T17:00:00+05:30'),
      time: '5:00 PM',
      endTime: '8:00 PM',
      location: 'Main Temple, Khalane',
      tags: ['prasad', 'closing', 'puja'],
    },
  ]);
  console.log(`✅ ${events.length} events created`);

  // ── Announcements ─────────────────────────────────────────────────────────
  await Announcement.deleteMany({});
  await Announcement.insertMany([
    {
      title: '🎉 Khalane Yatra Utsav 2025 Registration Open!',
      content: 'Registration for Khalane Yatra Utsav 2025 is now open. Register now for kabaddi, rangoli, and other competitive events. Limited seats available!',
      type: 'success',
      isPinned: true,
    },
    {
      title: '📢 Volunteer Recruitment Drive',
      content: 'We need enthusiastic volunteers to help organize the festival. Contact the committee at 98765 43210 to register as a volunteer.',
      type: 'info',
      isPinned: false,
    },
    {
      title: '⚠️ Parking Instructions',
      content: 'Parking is available near the school ground. Devotees are requested to use designated parking areas only. No parking on main road.',
      type: 'warning',
      isPinned: false,
    },
    {
      title: '🚨 Important: No Firecrackers Policy',
      content: 'In accordance with local regulations, use of firecrackers is strictly prohibited within the festival premises. Carry valid ID proof.',
      type: 'urgent',
      isPinned: true,
    },
  ]);
  console.log('✅ Announcements created');

  // ── Site Content ──────────────────────────────────────────────────────────
  await SiteContent.deleteMany({});
  await SiteContent.create({
    festivalDate: new Date('2025-04-14T00:00:00+05:30'),
    festivalYear: 2025,
    heroTitle: 'खलाने यात्रा उत्सव',
    heroSubtitle: 'A Grand Festival of Faith, Culture & Togetherness — Bringing the Village Together Since Centuries',
    historyTitle: 'History of Khalane Yatra',
    historyContent: `Khalane Yatra Utsav is an ancient and revered annual festival celebrated in the scenic village of Khalane, nestled in the heart of Maharashtra. 

This centuries-old tradition began as a sacred pilgrimage dedicated to the village deity, drawing devotees from across the region who travel with deep faith and devotion.

Over generations, the Yatra has blossomed into a magnificent 3-day festival that beautifully blends religious devotion with cultural richness. It is more than just a festival — it is the heartbeat of the community, a time when families reunite, friendships are forged, and the village comes alive with music, color, and joy.

The festival showcases the best of Maharashtrian culture through traditional folk arts, Tamasha performances, devotional kirtans, and competitive sports. The grand procession (Miravnuk) remains the most spectacular moment, with thousands marching together in unity and celebration.

Today, Khalane Yatra Utsav is not just a local event — it is a testament to the enduring spirit, traditions, and togetherness of the people of Khalane.`,
    highlights: [
      { icon: '🛕', title: 'Sacred Puja', description: 'Daily morning and evening puja ceremonies at the historic main temple with hundreds of devotees.' },
      { icon: '🎭', title: 'Cultural Programs', description: 'Traditional Tamasha, Kirtan, folk dance and drama performances by renowned artists.' },
      { icon: '🏆', title: 'Sports Events', description: 'Inter-village kabaddi, cricket, and traditional sports competitions with exciting prizes.' },
      { icon: '🍱', title: 'Food Mela', description: 'Authentic Maharashtrian cuisine, prasad distribution, and traditional delicacies from local SHGs.' },
      { icon: '🎆', title: 'Grand Procession', description: 'Spectacular Yatra Miravnuk procession with decorated palanquins, music, and community spirit.' },
      { icon: '🎨', title: 'Art & Craft', description: 'Rangoli competitions, art exhibitions, and showcase of village craftsmanship and heritage.' },
    ],
    contactEmail: 'info@digitalkhalane.in',
    contactPhone: '+91 8600835109',
    contactAddress: 'Khalane Village, tal Shindhkheda, Dist Dhule Maharashtra - 425407',
    bankName: 'State Bank of India, Khalane Branch',
    accountNumber: '1234 5678 9012 3456',
    ifscCode: 'SBIN0012345',
    upiId: 'khalaneyatra@sbi',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30150.10!2d73.7818!3d19.9975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDAwJzAwLjAiTiA3M8KwNDgnMTIuNCJF!5e0!3m2!1sen!2sin!4v1617800000000',
  });
  console.log('✅ Site content created');

  console.log('\n🎉 Seed complete! Admin credentials:');
  console.log('   Email: admin@digitalkhalane.in');
  console.log('   Password: khalane@2024\n');

  process.exit(0);
};

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
