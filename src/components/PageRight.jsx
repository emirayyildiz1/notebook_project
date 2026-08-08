/**
 * PageRight.jsx
 * The right ("recto") page of the open book.
 * - Read-only display — no editing, no saving.
 * - Date shown at top-right.
 * - Full-height read-only textarea with lined paper look.
 */

/**
 * @param {object} page    - Current page data {id, date, content}
 * @param {number} pageNum - Display page number
 */
export default function PageRight({ page, pageNum }) {
  const date    = page?.date ?? '';
  const content = page?.content ?? '';

  return (
    <div
      className="
        relative flex flex-col h-full
        bg-[#fdf9f0]
        rounded-r-sm
        overflow-hidden
        page-right-shadow
      "
      style={{
        backgroundImage: `
          radial-gradient(ellipse at 0% 0%, rgba(238,220,174,0.4) 0%, transparent 55%),
          radial-gradient(ellipse at 100% 100%, rgba(245,232,200,0.5) 0%, transparent 50%)
        `,
      }}
    >
      {/* ── Left shadow (spine side) ── */}
      <div
        className="absolute left-0 top-0 bottom-0 w-4 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.10), transparent)',
        }}
      />

      {/* ── Red margin line ── */}
      <div
        className="absolute top-0 bottom-0 pointer-events-none"
        style={{
          left: '52px',
          width: '1px',
          background: 'rgba(180,60,60,0.2)',
        }}
      />

      {/* ── Header: page label + date display ── */}
      <div className="flex items-start justify-between px-8 pt-5 pb-2 flex-shrink-0 relative z-10">
        {/* Left: ornamental page label */}
        <span
          className="text-xs tracking-[0.2em] uppercase text-[#8b7055] opacity-50 mt-1"
          style={{ fontFamily: "'Lora', Georgia, serif" }}
        >
          Diary
        </span>

        {/* Right: date (read-only) */}
        <div className="flex flex-col items-end gap-1">
          {date && (
            <span
              className="text-sm text-[#8b7055] opacity-70"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          )}
        </div>
      </div>

      {/* ── Decorative divider ── */}
      <hr className="decorative-divider mx-8 flex-shrink-0" />

      {/* ── Content with lined paper background (read-only) ── */}
      <div
        className="flex-1 relative overflow-hidden px-8 pt-1"
        style={{
          backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #dfd0ae 27px, #dfd0ae 28px)',
          backgroundSize: '100% 28px',
          backgroundPosition: '0 0',
        }}
      >
        <div
          className="diary-textarea h-full overflow-y-auto whitespace-pre-wrap break-words"
          aria-label="Diary entry content"
          style={{ lineHeight: '28px' }}
        >
          {content || (
            <span className="opacity-40 italic text-[#8b7055]"
              style={{ fontFamily: "'Caveat', cursive" }}>
              — No entry —
            </span>
          )}
        </div>
      </div>

      {/* ── Footer: page number ── */}
      <div className="flex items-center justify-end px-8 pt-2 pb-3 flex-shrink-0">
        <span className="page-number">{pageNum}</span>
      </div>
    </div>
  );
}
