const JSON_HEADERS = {
  Accept: 'application/json',
};

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

function buildApiUrl(path) {
  return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
}

function appendFiles(formData, files, quality) {
  files.forEach((file) => {
    formData.append('images', file);
  });
  formData.append('quality', String(quality));
}

async function parseResponse(response) {
  if (response.ok) {
    return response;
  }

  let errorMessage = 'Something went wrong while processing your files.';

  try {
    const payload = await response.json();
    errorMessage = payload.message || errorMessage;
  } catch {
    errorMessage = response.statusText || errorMessage;
  }

  throw new Error(errorMessage);
}

export async function compressImages(files, quality) {
  const formData = new FormData();
  appendFiles(formData, files, quality);

  const response = await fetch(buildApiUrl('/api/compress-image'), {
    method: 'POST',
    body: formData,
    headers: JSON_HEADERS,
  });

  await parseResponse(response);
  return response.json();
}

export async function downloadZip(files, quality) {
  const formData = new FormData();
  appendFiles(formData, files, quality);

  const response = await fetch(buildApiUrl('/api/download-zip'), {
    method: 'POST',
    body: formData,
  });

  await parseResponse(response);
  return response.blob();
}

export async function convertPdf(files) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('images', file);
  });

  const response = await fetch(buildApiUrl('/api/convert-pdf'), {
    method: 'POST',
    body: formData,
  });

  await parseResponse(response);
  return response.blob();
}