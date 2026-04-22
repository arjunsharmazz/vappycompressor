const multer = require('multer');
const path = require('path');

const maxFileSizeMb = Number(process.env.MAX_FILE_SIZE_MB || 5);
const maxFileSizeBytes = maxFileSizeMb * 1024 * 1024;
const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: maxFileSizeBytes,
    files: 20,
  },
  fileFilter: (_request, file, callback) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      callback(new Error('Only JPG, JPEG, PNG, and WEBP images are allowed.'));
      return;
    }

    callback(null, true);
  },
});

function parseQuality(inputQuality) {
  const quality = Number(inputQuality);
  if (Number.isNaN(quality)) {
    return 70;
  }

  return Math.min(90, Math.max(10, Math.round(quality)));
}

function getSafeBaseName(filename) {
  return path.basename(filename, path.extname(filename)).replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
}

function getExtensionForMimeType(mimeType) {
  switch (mimeType) {
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    default:
      return 'jpg';
  }
}

module.exports = {
  allowedMimeTypes,
  getExtensionForMimeType,
  getSafeBaseName,
  parseQuality,
  upload,
};