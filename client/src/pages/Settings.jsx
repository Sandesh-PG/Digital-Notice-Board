function SettingsPage() {
  return (
    <div className="w-full max-w-none">
      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_36px_-30px_rgba(15,23,42,0.9)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Account</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-800">Settings</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          Manage your account preferences and dashboard experience.
        </p>
      </section>
    </div>
  );
}

export default SettingsPage;
