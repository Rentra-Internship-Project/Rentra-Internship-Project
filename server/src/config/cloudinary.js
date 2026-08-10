// Cloudinary Storage Pipeline Helper
function generateCloudinaryUrl(filename) {
  const cleanName = (filename || 'machinery.jpg').replace(/[^a-zA-Z0-9._-]/g, '_');
  return `https://res.cloudinary.com/rentra-assets/image/upload/v1723400/equipment_${Date.now()}_${cleanName}`;
}

module.exports = { generateCloudinaryUrl };
