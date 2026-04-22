function ImagePreview({ files, onDownload, onRemove }) {
  if (!files.length) {
    return null;
  }

  return (
    <section className="rounded-[2rem] bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900">Selected images</h3>
          <p className="text-sm text-slate-500">Preview the files before compressing or exporting.</p>
        </div>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
          {files.length} file{files.length > 1 ? 's' : ''}
        </span>
      </div>
      <div className="soft-scrollbar grid max-h-[34rem] gap-4 overflow-y-auto pr-2 sm:grid-cols-2 xl:grid-cols-3">
        {files.map((file) => (
          <article key={file.id} className="overflow-hidden rounded-[1.5rem] border border-slate-100 bg-slate-50">
            <div className="aspect-[4/3] bg-white">
              <img className="h-full w-full object-cover" src={file.previewUrl} alt={file.name} />
            </div>
            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="line-clamp-1 text-sm font-bold text-slate-900">{file.name}</h4>
                  <p className="text-xs text-slate-500">Original: {file.originalSizeLabel}</p>
                  <p className="text-xs text-slate-500">
                    {file.compressedSizeLabel ? `Compressed: ${file.compressedSizeLabel}` : 'Compressed size will show here'}
                  </p>
                </div>
                <div className="flex gap-2">
                  {file.compressedBlob ? (
                    <button
                      className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600 transition hover:border-brand-300 hover:bg-brand-100"
                      type="button"
                      onClick={() => onDownload(file.id)}
                    >
                      Download
                    </button>
                  ) : null}
                  <button
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 transition hover:border-red-300 hover:text-red-500"
                    type="button"
                    onClick={() => onRemove(file.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              {file.reductionLabel ? (
                <div className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                  {file.reductionLabel} smaller
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ImagePreview;