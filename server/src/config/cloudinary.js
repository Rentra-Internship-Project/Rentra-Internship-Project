const cloudinary = require('cloudinary').v2;

const cloudinaryUrl = process.env.CLOUDINARY_URL;
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'gzkkyuqg';
const apiKey = process.env.CLOUDINARY_API_KEY || '219791399123473';
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudinaryUrl) {
  cloudinary.config({
    cloudinary_url: cloudinaryUrl,
  });
} else {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret || 'demo_secret',
    secure: true,
  });
}

function generateCloudinaryUrl(filename) {
  const cleanName = (filename || 'machinery.jpg').replace(/[^a-zA-Z0-9._-]/g, '_');
  const activeCloud = cloudinaryUrl
    ? cloudinaryUrl.split('@')[1] || cloudName
    : cloudName;

  return `https://res.cloudinary.com/${activeCloud}/image/upload/v1723400/equipment_${Date.now()}_${cleanName}`;
}

module.exports = { cloudinary, generateCloudinaryUrl };
