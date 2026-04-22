const JSZip = require('jszip');

async function createZip(files) {
  const zip = new JSZip();

  files.forEach((file) => {
    zip.file(file.fileName, file.buffer);
  });

  return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 9 } });
}

module.exports = {
  createZip,
};