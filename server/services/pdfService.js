const { PDFDocument } = require('pdf-lib');
const sharp = require('sharp');

async function getEmbeddableImage(pdfDocument, file) {
  if (file.mimetype === 'image/png') {
    return pdfDocument.embedPng(file.buffer);
  }

  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
    return pdfDocument.embedJpg(file.buffer);
  }

  const pngBuffer = await sharp(file.buffer).png().toBuffer();
  return pdfDocument.embedPng(pngBuffer);
}

async function createPdf(files) {
  const pdfDocument = await PDFDocument.create();

  for (const file of files) {
    const embeddedImage = await getEmbeddableImage(pdfDocument, file);
    const { width, height } = embeddedImage.scale(1);
    const page = pdfDocument.addPage([width, height]);

    page.drawImage(embeddedImage, {
      x: 0,
      y: 0,
      width,
      height,
    });
  }

  return pdfDocument.save();
}

module.exports = {
  createPdf,
};