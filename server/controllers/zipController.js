const { compressImages } = require('../services/imageService');
const { createZip } = require('../services/zipService');
const { parseQuality } = require('../utils/fileHelper');

async function downloadZip(request, response, next) {
  try {
    const files = request.files || [];
    if (files.length < 2) {
      return response.status(400).json({ message: 'Please upload at least two images to create a ZIP file.' });
    }

    const quality = parseQuality(request.body.quality);
    const compressedFiles = await compressImages(files, quality);
    const zipBuffer = await createZip(compressedFiles);

    response.setHeader('Content-Type', 'application/zip');
    response.setHeader('Content-Disposition', 'attachment; filename="vappy-compressed-images.zip"');
    return response.send(zipBuffer);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  downloadZip,
};