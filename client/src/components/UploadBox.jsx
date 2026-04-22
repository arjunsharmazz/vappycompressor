function UploadBox({ disabled, dragActive, onDragStateChange, onFilesSelected }) {
  const handleInputChange = (event) => {
    onFilesSelected(Array.from(event.target.files || []));
    event.target.value = '';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    onDragStateChange(false);
    if (disabled) {
      return;
    }

    onFilesSelected(Array.from(event.dataTransfer.files || []));
  };

  return (
    <label
      className={`flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-[2rem] border-2 border-dashed px-6 py-10 text-center transition-all duration-200 ${
        dragActive
          ? 'border-brand-500 bg-brand-50 shadow-soft'
          : 'border-brand-100 bg-white/90 hover:border-brand-500 hover:bg-brand-50/70'
      } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
      onDragEnter={() => onDragStateChange(true)}
      onDragLeave={() => onDragStateChange(false)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-3xl text-brand-600">
        +
      </div>
      <h2 className="text-2xl font-extrabold text-slate-900">Drop images here</h2>
      <p className="mt-3 max-w-md text-sm text-slate-500">
        Drag one or many JPG, PNG, or WEBP files here, or tap the button below.
      </p>
      <span className="mt-6 inline-flex rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white shadow-soft">
        Choose Images
      </span>
      <p className="mt-4 text-xs font-medium uppercase tracking-[0.28em] text-slate-400">
        Max 5 MB per image
      </p>
      <input
        hidden
        multiple
        accept="image/png,image/jpeg,image/jpg,image/webp"
        disabled={disabled}
        type="file"
        onChange={handleInputChange}
      />
    </label>
  );
}

export default UploadBox;