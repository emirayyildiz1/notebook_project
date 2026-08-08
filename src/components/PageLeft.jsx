/**
 * PageLeft.jsx
 * The left ("verso") page of the open book.
 * - On the first spread: shows a decorative diary cover with title.
 * - On subsequent spreads: shows a read-only preview of the previous entry.
 */

const OrnamentSVG = () => (
  <svg
    viewBox="0 0 120 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-24 mx-auto opacity-40"
  >
    <line x1="0" y1="10" x2="45" y2="10" stroke="#8b5e3c" strokeWidth="1" />
    <circle cx="60" cy="10" r="4" stroke="#8b5e3c" strokeWidth="1" />
    <circle cx="60" cy="10" r="1.5" fill="#8b5e3c" />
    <line x1="75" y1="10" x2="120" y2="10" stroke="#8b5e3c" strokeWidth="1" />
  </svg>
);

/**
 * @param {object|null} page      - Previous page data {date, content}
 * @param {number}      pageNum   - Display page number (left page)
 * @param {boolean}     isFirst   - True when this is the very first spread
 */
export default function PageLeft({ page, pageNum, isFirst }) {
  return (
    <div
      className="
        relative flex flex-col h-full
        bg-[#faf3e0]
        rounded-l-sm
        overflow-hidden
        select-none
      "
      style={{
        boxShadow: '4px 0 12px rgba(0,0,0,0.12), 2px 0 4px rgba(0,0,0,0.08)',
        backgroundImage: `
          radial-gradient(ellipse at 100% 0%, rgba(238,220,174,0.6) 0%, transparent 60%),
          radial-gradient(ellipse at 0% 100%, rgba(238,220,174,0.4) 0%, transparent 50%)
        `,
      }}
    >
      {/* ── Aged paper edge (left) ── */}
      <div
        className="absolute left-0 top-0 bottom-0 w-3 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, rgba(180,150,100,0.3), transparent)',
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

      {/* ── Content area ── */}
      <div className="flex-1 flex flex-col px-8 pt-6 pb-4 overflow-hidden">
        {isFirst ? (
          /* ── Cover page content ── */
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <OrnamentSVG />
            <h1
              className="text-3xl font-bold text-[#3d2b1f] leading-tight mt-2"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic' }}
            >
              My Diary
            </h1>
            <OrnamentSVG />
            <p
              className="text-sm text-[#6b5243] mt-4 leading-relaxed max-w-[180px]"
              style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: 'italic' }}
            >
              A collection of thoughts, memories, and moments in time.
            </p>

            {/* Decorative bookmark ribbon */}
            <div className="mt-8 flex flex-col items-center gap-1 opacity-30">
              <div className="w-px h-8 bg-[#8b5e3c]" />
              <div
                className="w-4 h-4 rotate-45 bg-[#8b5e3c]"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)' }}
              />
            </div>
          </div>
        ) : (
          /* ── Previous page preview ── */
          <>
            {/* Date header */}
            <div className="flex items-center justify-end mb-3">
              {page?.date && (
                <span
                  className="text-sm text-[#8b7055] opacity-70"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  {new Date(page.date + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              )}
            </div>

            <hr className="decorative-divider mb-3" />

            {/* Content preview — lined background, read-only */}
            <div
              className="flex-1 overflow-hidden relative"
              style={{
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #dfd0ae 27px, #dfd0ae 28px)',
                backgroundSize: '100% 28px',
                backgroundPosition: '0 0',
              }}
            >
              <p
                className="text-sm leading-7 text-[#6b5243] opacity-60 whitespace-pre-wrap break-words"
                style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: 'italic', lineHeight: '28px' }}
              >
                {page?.content
                  ? page.content.slice(0, 500) + (page.content.length > 500 ? '…' : '')
                  : (
                    <span className="opacity-40 italic">— No entry —</span>
                  )}
              </p>
            </div>
          </>
        )}
      </div>

      {/* ── Page number ── */}
      <div className="flex justify-start px-8 pb-3">
        <span className="page-number">{isFirst ? '✦' : pageNum}</span>
      </div>
    </div>
  );
}
