const {
  createImageBuffer,
  createPdfBuffer,
  sanitizeDownloadName,
} = require('../services/builderService');

function getRequestPayload(request) {
  const { html, styles, title } = request.body || {};

  if (typeof html !== 'string' || !html.trim()) {
    const error = new Error('HTML content is required.');
    error.statusCode = 400;
    throw error;
  }

  return {
    html,
    styles: typeof styles === 'string' ? styles : '',
    title: sanitizeDownloadName(title || 'vappybuilder-document'),
  };
}

function handleBuilderError(response, error, fallbackMessage) {
  const statusCode = error.statusCode || 500;

  return response.status(statusCode).json({
    error: fallbackMessage,
    details: error.message,
  });
}

async function generatePdf(request, response) {
  try {
    const payload = getRequestPayload(request);
    const pdfBuffer = await createPdfBuffer(payload);

    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', `attachment; filename="${payload.title}.pdf"`);
    return response.send(pdfBuffer);
  } catch (error) {
    return handleBuilderError(response, error, 'Unable to generate PDF.');
  }
}

async function generateImage(request, response) {
  try {
    const payload = getRequestPayload(request);
    const imageBuffer = await createImageBuffer(payload);

    response.setHeader('Content-Type', 'image/png');
    response.setHeader('Content-Disposition', `attachment; filename="${payload.title}.png"`);
    return response.send(imageBuffer);
  } catch (error) {
    return handleBuilderError(response, error, 'Unable to generate image.');
  }
}

function getBuilderHealth(_request, response) {
  response.json({ status: 'ok', service: 'vappy-builder-api' });
}

module.exports = {
  generatePdf,
  generateImage,
  getBuilderHealth,
};