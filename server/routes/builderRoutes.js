const express = require('express');
const {
  generateImage,
  generatePdf,
  getBuilderHealth,
} = require('../controllers/builderController');

const router = express.Router();

router.get('/health', getBuilderHealth);
router.post('/generate-pdf', generatePdf);
router.post('/generate-image', generateImage);

module.exports = router;