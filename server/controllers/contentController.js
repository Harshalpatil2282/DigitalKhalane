/**
 * Site Content Controller - CMS for homepage
 */

const SiteContent = require('../models/SiteContent');

// Always uses a singleton document
const getContent = async (req, res, next) => {
  try {
    let content = await SiteContent.findOne();
    if (!content) {
      // Create default content if none exists
      content = await SiteContent.create({
        highlights: [
          { icon: '🛕', title: 'Sacred Puja', description: 'Daily morning and evening puja ceremonies at the main temple.' },
          { icon: '🎭', title: 'Cultural Programs', description: 'Traditional dance, drama and folk music performances.' },
          { icon: '🏆', title: 'Sports Events', description: 'Kabaddi, cricket, and traditional sports competitions.' },
          { icon: '🍱', title: 'Food Festival', description: 'Traditional Maharashtrian cuisine and prasad distribution.' },
          { icon: '🎆', title: 'Grand Procession', description: 'Spectacular Yatra procession through the village.' },
          { icon: '🎨', title: 'Art & Craft', description: 'Exhibition of local art, crafts and cultural heritage.' },
        ],
      });
    }
    res.json({ success: true, content });
  } catch (error) { next(error); }
};

const updateContent = async (req, res, next) => {
  try {
    let content = await SiteContent.findOne();
    if (!content) {
      content = await SiteContent.create(req.body);
    } else {
      Object.assign(content, req.body);
      await content.save();
    }
    res.json({ success: true, message: 'Content updated successfully', content });
  } catch (error) { next(error); }
};

module.exports = { getContent, updateContent };
