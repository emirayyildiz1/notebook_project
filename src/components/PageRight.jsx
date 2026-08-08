/**
 * PageRight.jsx
 * The right ("recto") active writing page.
 * - Date input pinned at top-right.
 * - Full-height borderless textarea with lined paper.
 * - Debounced auto-save to Firestore.
 * - "New Page" button at the bottom when on the last page.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { savePage } from '../firebase/diaryService';

/**
 * @param {object}   page         - Current page data {id, date, content}
 * @param {number}   pageNum      - Display page number
 * @param {boolean}  isLast       - True when viewing the last page
 * @param {Function} onAddPage    - Called when user clicks "+ New Page"
 * @param {Function} onPageUpdate - Callback to sync updated page back to parent state
 */
export default function PageRight({ page, pageNum, isLast, onAddPage, onPageUpdate }) {
  const [date, setDate] = useState(page?.date ?? '');
  const [content, setContent] = useState(page?.content ?? '');
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'
  const textareaRef = useRef(null);

  // Keep local state in sync when the parent switches pages
  useEffect(() => {
    setDate(page?.date ?? '');
    setContent(page?.content ?? '');
    setSaveStatus('idle');
  }, [page?.id]);

  // ── Debounced values ──────────────────────────────────────────────
  const debouncedDate    = useDebounce(date,    800);
  const debouncedContent = useDebounce(content, 800);

  // ── Auto-save whenever debounced values settle ────────────────────
  const isMounted = useRef(false);

  useEffect(() => {
    // Skip the very first render (no changes yet)
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (!page?.id) return;

    const persist = async () => {
      setSaveStatus('saving');
      try {
        await savePage(page.id, { date: debouncedDate, content: debouncedContent });
        onPageUpdate(page.id, { date: debouncedDate, content: debouncedContent });
        setSaveStatus('saved');
      } catch (err) {
        console.error('Auto-save failed:', err);
        setSaveStatus('error');
      }
      // Fade "saved" indicator after 2 s
      setTimeout(() => setSaveStatus('idle'), 2000);
    };

    persist();
  }, [debouncedDate, debouncedContent]);

  // Reset mount guard when page id changes
  useEffect(() => {
    isMounted.current = false;
  }, [page?.id]);

  // ── Auto-focus textarea on mount / page change ────────────────────
  useEffect(() => {
    const timer = setTimeout(() => textareaRef.current?.focus(), 350);
    return () => clearTimeout(timer);
  }, [page?.id]);

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

      {/* ── Header: page label + date input ── */}
      <div className="flex items-start justify-between px-8 pt-5 pb-2 flex-shrink-0 relative z-10">
        {/* Left: ornamental page label */}
        <span
          className="text-xs tracking-[0.2em] uppercase text-[#8b7055] opacity-50 mt-1"
          style={{ fontFamily: "'Lora', Georgia, serif" }}
        >
          Diary
        </span>

        {/* Right: date input */}
        <div className="flex flex-col items-end gap-1">
          <input
            id="diary-date-input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="date-input"
            aria-label="Entry date"
          />
          {/* Save status indicator */}
          <div className="h-4 flex items-center gap-1">
            {saveStatus === 'saving' && (
              <span className="flex items-center gap-1 text-[10px] text-[#8b7055] opacity-70"
                style={{ fontFamily: "'Caveat', cursive" }}>
                <span className="saving-dot w-1.5 h-1.5 rounded-full bg-[#8b7055] inline-block" />
                saving…
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="text-[10px] text-[#6b8b5e] opacity-70 transition-opacity"
                style={{ fontFamily: "'Caveat', cursive" }}>
                ✓ saved
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="text-[10px] text-red-400 opacity-80"
                style={{ fontFamily: "'Caveat', cursive" }}>
                ✗ error
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Decorative divider ── */}
      <hr className="decorative-divider mx-8 flex-shrink-0" />

      {/* ── Textarea with lined paper background ── */}
      <div
        className="flex-1 relative overflow-hidden px-8 pt-1"
        style={{
          backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #dfd0ae 27px, #dfd0ae 28px)',
          backgroundSize: '100% 28px',
          backgroundPosition: '0 0',
        }}
      >
        <textarea
          ref={textareaRef}
          id="diary-content-textarea"
          className="diary-textarea h-full"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Begin your thoughts here…"
          aria-label="Diary entry content"
          style={{ lineHeight: '28px' }}
          spellCheck="true"
        />
      </div>

      {/* ── Footer: page number + new page btn ── */}
      <div className="flex items-center justify-between px-8 pt-2 pb-3 flex-shrink-0">
        <div />
        <span className="page-number">{pageNum}</span>
        {isLast && (
          <button
            id="add-new-page-btn"
            onClick={onAddPage}
            className="
              text-xs font-medium
              text-[#8b5e3c] hover:text-[#6b3a2a]
              border border-[#c9a84c]/40 hover:border-[#8b5e3c]
              rounded px-3 py-1
              transition-all duration-200
              opacity-60 hover:opacity-100
            "
            style={{ fontFamily: "'Caveat', cursive", fontSize: '0.95rem' }}
          >
            + New Page
          </button>
        )}
        {!isLast && <div />}
      </div>
    </div>
  );
}
