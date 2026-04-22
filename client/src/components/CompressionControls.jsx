function CompressionControls({ disabled, quality, onQualityChange, onClear, onCompress }) {
  return (
    <section className="rounded-[2rem] bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700">
            <span>Compression quality</span>
            <span className="rounded-full bg-brand-50 px-3 py-1 text-brand-600">{quality}%</span>
          </div>
          <input
            className="w-full"
            type="range"
            min="10"
            max="90"
            step="5"
            value={quality}
            disabled={disabled}
            onChange={(event) => onQualityChange(Number(event.target.value))}
          />
          <div className="mt-2 flex justify-between text-xs text-slate-400">
            <span>Smaller file</span>
            <span>Better quality</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            className="rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            disabled={disabled}
            onClick={onClear}
          >
            Clear All
          </button>
          <button
            className="rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            disabled={disabled}
            onClick={onCompress}
          >
            Compress Images
          </button>
        </div>
      </div>
    </section>
  );
}

export default CompressionControls;