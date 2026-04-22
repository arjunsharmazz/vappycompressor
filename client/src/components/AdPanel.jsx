function AdPanel() {
  return (
    <aside className="lg:sticky lg:top-6">
      <div className="overflow-hidden rounded-[2rem] bg-white shadow-soft">
        <div className="bg-gradient-to-br from-brand-50 via-white to-brand-100 p-6">
          <div className="mb-6 flex items-center gap-3">
            <img className="h-14 w-14 rounded-2xl" src="/vappy-logo.svg" alt="Vappy Shop logo" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-600">Vappy Shop</p>
              <h2 className="text-xl font-extrabold text-slate-900">Tools, offers, and quick picks</h2>
            </div>
          </div>
          <p className="text-sm leading-6 text-slate-600">
            Explore the Vappy Shop for simple digital tools, smart bundles, and useful everyday resources.
          </p>
          <a
            className="mt-6 inline-flex rounded-full bg-brand-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-600"
            href="https://www.vappyshop.com/"
            target="_blank"
            rel="noreferrer"
          >
            Visit Shop
          </a>
        </div>
        <div className="p-4">
          <img className="w-full rounded-[1.5rem]" src="https://www.vappyshop.com/static/media/512x512%20px.b66372c34e6d3462ca0f.png" alt="Vappy Shop banner" />
        </div>
      </div>
    </aside>
  );
}

export default AdPanel;