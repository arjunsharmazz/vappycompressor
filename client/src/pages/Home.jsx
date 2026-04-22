import { useEffect, useRef, useState } from 'react';
import AdPanel from '../components/AdPanel';
import CompressionControls from '../components/CompressionControls';
import DownloadButtons from '../components/DownloadButtons';
import ImagePreview from '../components/ImagePreview';
import UploadBox from '../components/UploadBox';
import { compressImages, convertPdf, downloadZip } from '../utils/api';

function formatBytes(bytes) {
  if (!bytes) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** unitIndex;
  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

function buildLocalFileEntry(file) {
  return {
    id: `${file.name}-${file.size}-${file.lastModified}`,
    file,
    name: file.name,
    previewUrl: URL.createObjectURL(file),
    originalSize: file.size,
    originalSizeLabel: formatBytes(file.size),
    compressedSizeLabel: '',
    reductionLabel: '',
    compressedBlob: null,
    compressedFileName: '',
  };
}

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function Home() {
  const [items, setItems] = useState([]);
  const [quality, setQuality] = useState(70);
  const [dragActive, setDragActive] = useState(false);
  const [busyAction, setBusyAction] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const itemsRef = useRef([]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    return () => {
      itemsRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  const selectedFiles = items.map((item) => item.file);
  const isBusy = Boolean(busyAction);
  const hasCompressedFiles = items.some((item) => item.compressedBlob);

  const handleFilesSelected = (fileList) => {
    setErrorMessage('');

    const invalidFiles = fileList.filter((file) => !ALLOWED_TYPES.has(file.type) || file.size > MAX_FILE_SIZE);
    const validFiles = fileList.filter((file) => ALLOWED_TYPES.has(file.type) && file.size <= MAX_FILE_SIZE);

    if (invalidFiles.length) {
      setErrorMessage('Only JPG, PNG, and WEBP files up to 5 MB are allowed.');
    }

    if (!validFiles.length) {
      return;
    }

    const nextItems = validFiles.map(buildLocalFileEntry);

    setItems((currentItems) => {
      const knownIds = new Set(currentItems.map((item) => item.id));
      const uniqueItems = nextItems.filter((item) => !knownIds.has(item.id));
      return [...currentItems, ...uniqueItems];
    });
  };

  const handleRemove = (id) => {
    setItems((currentItems) => {
      const itemToRemove = currentItems.find((item) => item.id === id);
      if (itemToRemove) {
        URL.revokeObjectURL(itemToRemove.previewUrl);
      }
      return currentItems.filter((item) => item.id !== id);
    });
  };

  const handleClear = () => {
    items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setItems([]);
    setErrorMessage('');
  };

  const handleCompress = async () => {
    if (!selectedFiles.length) {
      setErrorMessage('Please choose at least one image first.');
      return;
    }

    try {
      setBusyAction('Compressing your images...');
      setErrorMessage('');

      const payload = await compressImages(selectedFiles, quality);

      setItems((currentItems) =>
        currentItems.map((item, index) => {
          const match = payload.files[index];
          if (!match) {
            return item;
          }

          const byteCharacters = atob(match.base64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let index = 0; index < byteCharacters.length; index += 1) {
            byteNumbers[index] = byteCharacters.charCodeAt(index);
          }

          const compressedBlob = new Blob([new Uint8Array(byteNumbers)], { type: match.mimeType });
          const reduction = item.originalSize > 0
            ? Math.max(0, Math.round(((item.originalSize - match.compressedSize) / item.originalSize) * 100))
            : 0;

          return {
            ...item,
            compressedBlob,
            compressedFileName: match.fileName,
            compressedSizeLabel: formatBytes(match.compressedSize),
            reductionLabel: `${reduction}%`,
          };
        }),
      );
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setBusyAction('');
    }
  };

  const handleDownloadSingle = () => {
    const fileToDownload = items.find((item) => item.compressedBlob);
    if (!fileToDownload?.compressedBlob) {
      setErrorMessage('Compress at least one image before downloading.');
      return;
    }

    downloadBlob(fileToDownload.compressedBlob, fileToDownload.compressedFileName || `compressed-${fileToDownload.name}`);
  };

  const handleDownloadItem = (id) => {
    const fileToDownload = items.find((item) => item.id === id);
    if (!fileToDownload?.compressedBlob) {
      return;
    }

    downloadBlob(fileToDownload.compressedBlob, fileToDownload.compressedFileName || `compressed-${fileToDownload.name}`);
  };

  const handleDownloadZip = async () => {
    if (selectedFiles.length < 2) {
      setErrorMessage('ZIP download is available when you upload multiple images.');
      return;
    }

    try {
      setBusyAction('Building your ZIP file...');
      setErrorMessage('');
      const zipBlob = await downloadZip(selectedFiles, quality);
      downloadBlob(zipBlob, 'vappy-compressed-images.zip');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setBusyAction('');
    }
  };

  const handleDownloadPdf = async () => {
    if (!selectedFiles.length) {
      setErrorMessage('Please choose images before exporting a PDF.');
      return;
    }

    try {
      setBusyAction('Creating your PDF...');
      setErrorMessage('');
      const pdfBlob = await convertPdf(selectedFiles);
      downloadBlob(pdfBlob, 'vappy-images.pdf');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setBusyAction('');
    }
  };

  return (
    <div className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-6 rounded-[2rem] bg-white/90 px-6 py-6 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <img className="h-16 w-16 rounded-[1.5rem]" src="/vappy-logo.svg" alt="Vappy Compressor logo" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-600">Simple file tools</p>
                <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Vappy Compressor</h1>
              </div>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-500">
              Compress your images, turn them into a PDF, or download everything as a ZIP with one clean workflow.
            </p>
          </div>
        </header>

        <main className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(280px,3fr)]">
          <section className="space-y-6">
            <UploadBox
              disabled={isBusy}
              dragActive={dragActive}
              onDragStateChange={setDragActive}
              onFilesSelected={handleFilesSelected}
            />

            <CompressionControls
              disabled={isBusy || !items.length}
              quality={quality}
              onQualityChange={setQuality}
              onClear={handleClear}
              onCompress={handleCompress}
            />

            {busyAction ? (
              <div className="flex items-center gap-4 rounded-[2rem] bg-white p-5 shadow-soft">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-100 border-t-brand-500" />
                <div>
                  <h2 className="text-base font-bold text-slate-900">Please wait</h2>
                  <p className="text-sm text-slate-500">{busyAction}</p>
                </div>
              </div>
            ) : null}

            {errorMessage ? (
              <div className="rounded-[2rem] border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
                {errorMessage}
              </div>
            ) : null}

            <ImagePreview files={items} onDownload={handleDownloadItem} onRemove={handleRemove} />

            <DownloadButtons
              disabled={isBusy}
              hasCompressedFiles={hasCompressedFiles}
              hasMultipleFiles={items.length > 1}
              onDownloadPdf={handleDownloadPdf}
              onDownloadZip={handleDownloadZip}
              onDownloadSingle={handleDownloadSingle}
            />
          </section>

          <AdPanel />
        </main>

        <footer className="mt-6 rounded-[2rem] bg-white/90 px-6 py-5 text-center text-sm font-semibold text-slate-500 shadow-soft backdrop-blur">
          Powered by Vappy Shop
        </footer>
      </div>
    </div>
  );
}

export default Home;