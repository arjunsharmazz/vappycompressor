const sharp = require('sharp');
const { getExtensionForMimeType, getSafeBaseName } = require('../utils/fileHelper');

async function compressSingleImage(file, quality) {
  const basePipeline = sharp(file.buffer).rotate();
  let outputBuffer;
  let mimeType;

  if (file.mimetype === 'image/png') {
    outputBuffer = await basePipeline
      .png({ quality, compressionLevel: 9, palette: true })
      .toBuffer();
    mimeType = 'image/png';
  } else if (file.mimetype === 'image/webp') {
    outputBuffer = await basePipeline.webp({ quality }).toBuffer();
    mimeType = 'image/webp';
  } else {
    outputBuffer = await basePipeline.jpeg({ quality, mozjpeg: true }).toBuffer();
    mimeType = 'image/jpeg';
  }

  const fileName = `${getSafeBaseName(file.originalname)}-compressed.${getExtensionForMimeType(mimeType)}`;

  return {
    fileName,
    originalName: file.originalname,
    originalSize: file.size,
    compressedSize: outputBuffer.length,
    mimeType,
    buffer: outputBuffer,
  };
}

async function compressImages(files, quality) {
  return Promise.all(files.map((file) => compressSingleImage(file, quality)));
}

module.exports = {
  compressImages,
};