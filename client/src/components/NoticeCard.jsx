import PropTypes from "prop-types";

const NoticeCard = ({ notice }) => {
  const expiryText = notice?.expiryDate
    ? new Date(notice.expiryDate).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <article className="mb-4 rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-[0_12px_35px_-28px_rgba(15,23,42,0.9)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-26px_rgba(6,95,70,0.45)]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold leading-snug text-slate-800 sm:text-xl">{notice?.title}</h2>
        {notice?.pinned && (
          <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
            Pinned
          </span>
        )}
      </div>
      <p className="mb-4 text-sm leading-relaxed text-slate-600 sm:text-base">{notice?.description}</p>
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium sm:text-sm">
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-700">
          {notice?.category || "General"}
        </span>
        {expiryText && (
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-600">
            Expires {expiryText}
          </span>
        )}
      </div>
    </article>
  );
};

NoticeCard.propTypes = {
  notice: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    pinned: PropTypes.bool,
    expiryDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  }),
};

export default NoticeCard;