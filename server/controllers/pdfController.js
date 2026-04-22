const { createPdf } = require('../services/pdfService');

async function convertPdf(request, response, next) {
  try {
    const files = request.files || [];
    if (!files.length) {
      return response.status(400).json({ message: 'Please upload at least one image.' });
    }

    const pdfBytes = await createPdf(files);
    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', 'attachment; filename="vappy-images.pdf"');
    return response.send(Buffer.from(pdfBytes));
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  convertPdf,
};