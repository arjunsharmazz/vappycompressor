const express = require('express');
const { compressImage } = require('../controllers/compressController');
const { convertPdf } = require('../controllers/pdfController');
const { downloadZip } = require('../controllers/zipController');
const { upload } = require('../utils/fileHelper');

const router = express.Router();

router.post('/compress-image', upload.array('images', 20), compressImage);
router.post('/convert-pdf', upload.array('images', 20), convertPdf);
router.post('/download-zip', upload.array('images', 20), downloadZip);

module.exports = router;