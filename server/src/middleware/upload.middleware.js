const { generateCloudinaryUrl } = require('../config/cloudinary');

function uploadMiddleware(req, res, next) {
  if (req.body && req.body.filename) {
    req.uploadedMediaUrl = generateCloudinaryUrl(req.body.filename);
  }
  next();
}

module.exports = uploadMiddleware;
