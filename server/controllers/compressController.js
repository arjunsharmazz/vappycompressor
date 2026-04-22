const { compressImages } = require('../services/imageService');
const { parseQuality } = require('../utils/fileHelper');

async function compressImage(request, response, next) {
  try {
    const files = request.files || [];
    if (!files.length) {
      return response.status(400).json({ message: 'Please upload at least one image.' });
    }

    const quality = parseQuality(request.body.quality);
    const compressedFiles = await compressImages(files, quality);

    return response.json({
      files: compressedFiles.map((file) => ({
        fileName: file.fileName,
        originalName: file.originalName,
        originalSize: file.originalSize,
        compressedSize: file.compressedSize,
        mimeType: file.mimeType,
        base64: file.buffer.toString('base64'),
      })),
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  compressImage,
};