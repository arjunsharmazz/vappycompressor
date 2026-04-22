const fs = require('fs');
const path = require('path');
const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');
const { PDFDocument } = require('pdf-lib');

const DEFAULT_STYLES = `
  body {
    margin: 0;
    background: #f3f7ff;
    font-family: Outfit, system-ui, sans-serif;
    padding: 24px;
  }

  * {
    box-sizing: border-box;
  }
`;

function buildHtmlDocument(html, styles = '') {
  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        ${DEFAULT_STYLES}
        ${styles}
      </style>
    </head>
    <body>
      ${html}
    </body>
  </html>`;
}

function sanitizeDownloadName(value) {
  const normalizedValue = String(value || 'vappybuilder-document').trim();
  const sanitizedValue = normalizedValue.replace(/[^a-zA-Z0-9-_]+/g, '-').replace(/-+/g, '-');

  return sanitizedValue.replace(/^-|-$/g, '') || 'vappybuilder-document';
}

function getLocalBrowserCandidates() {
  return [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    process.env.CHROME_PATH,
    path.join(process.env.PROGRAMFILES || '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
    path.join(process.env['PROGRAMFILES(X86)'] || '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
    path.join(process.env.LOCALAPPDATA || '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
    path.join(process.env.PROGRAMFILES || '', 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    path.join(process.env['PROGRAMFILES(X86)'] || '', 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
  ].filter(Boolean);
}

async function resolveExecutablePath() {
  const localExecutablePath = getLocalBrowserCandidates().find((candidate) => fs.existsSync(candidate));

  if (localExecutablePath) {
    return localExecutablePath;
  }

  try {
    return await chromium.executablePath();
  } catch (error) {
    throw new Error(
      'No Chromium executable found. Set PUPPETEER_EXECUTABLE_PATH or CHROME_PATH before starting the server.',
    );
  }
}

async function createBrowser() {
  const executablePath = await resolveExecutablePath();
  const chromiumArgs = Array.isArray(chromium.args) ? chromium.args : [];

  return puppeteer.launch({
    executablePath,
    headless: true,
    args: [...new Set([...chromiumArgs, '--no-sandbox', '--disable-setuid-sandbox'])],
  });
}

async function withPage(html, styles, work) {
  const browser = await createBrowser();

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1240, height: 1754, deviceScaleFactor: 2 });
    await page.setContent(buildHtmlDocument(html, styles), { waitUntil: 'networkidle0' });
    return await work(page);
  } finally {
    await browser.close();
  }
}

async function createPdfBuffer({ html, styles, title }) {
  const pdfBytes = await withPage(html, styles, async (page) =>
    page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '12mm', right: '12mm', bottom: '12mm', left: '12mm' },
    }),
  );

  const pdfDocument = await PDFDocument.load(pdfBytes);
  pdfDocument.setTitle(title);
  pdfDocument.setProducer('VappyBuilder');
  pdfDocument.setCreator('VappyBuilder');

  return Buffer.from(await pdfDocument.save());
}

async function createImageBuffer({ html, styles }) {
  return withPage(html, styles, async (page) => page.screenshot({ type: 'png', fullPage: true }));
}

module.exports = {
  createImageBuffer,
  createPdfBuffer,
  sanitizeDownloadName,
};