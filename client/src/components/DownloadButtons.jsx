function DownloadButtons({ disabled, hasCompressedFiles, hasMultipleFiles, onDownloadPdf, onDownloadZip, onDownloadSingle }) {
  if (!hasCompressedFiles) {
    return null;
  }

  return (
    <section className="rounded-[2rem] bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900">Downloads are ready</h3>
          <p className="text-sm text-slate-500">Choose the format you want and save your files.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {!hasMultipleFiles ? (
            <button
              className="rounded-full bg-brand-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              disabled={disabled}
              onClick={onDownloadSingle}
            >
              Download Image
            </button>
          ) : null}
          <button
            className="rounded-full border border-brand-200 bg-brand-50 px-5 py-3 text-sm font-bold text-brand-600 transition hover:border-brand-300 hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            disabled={disabled}
            onClick={onDownloadPdf}
          >
            Download PDF
          </button>
          {hasMultipleFiles ? (
            <button
              className="rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              disabled={disabled}
              onClick={onDownloadZip}
            >
              Download as ZIP
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default DownloadButtons;