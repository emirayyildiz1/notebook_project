/**
 * PageFlipBtn.jsx
 * Previous / Next navigation buttons rendered outside the book spread.
 */

const ChevronLeft = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

/**
 * @param {'prev'|'next'} direction
 * @param {boolean}       disabled
 * @param {Function}      onClick
 * @param {string}        label     - Screen-reader label
 */
export default function PageFlipBtn({ direction, disabled, onClick, label }) {
  const isPrev = direction === 'prev';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`
        nav-btn
        flex items-center justify-center
        w-12 h-12 rounded-full
        bg-[#8b5e3c]/80 hover:bg-[#6b3a2a]
        text-[#faf3e0]
        shadow-lg shadow-black/40
        border border-[#c9a84c]/30
        disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-[#8b5e3c]/80
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/50
      `}
    >
      {isPrev ? <ChevronLeft /> : <ChevronRight />}
    </button>
  );
}
