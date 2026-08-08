/**
 * Book.jsx
 * The central orchestrator component.
 * - Fetches all diary pages from Firestore on mount.
 * - Manages currentIndex state (which page is active).
 * - Triggers page-flip CSS animation on navigation.
 * - Passes page data to PageLeft / PageRight.
 * - Handles creating new pages.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { getAllPages, savePage } from '../firebase/diaryService';
import PageLeft from './PageLeft';
import PageRight from './PageRight';
import PageFlipBtn from './PageFlipBtn';
import LoadingSpinner from './LoadingSpinner';

/** Generate a simple unique ID (no external lib needed) */
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Today's date as YYYY-MM-DD */
function todayISO() {
  return new Date().toISOString().split('T')[0];
}

/** Create a blank page object (not yet saved to Firestore) */
function blankPage() {
  return { id: generateId(), date: todayISO(), content: '' };
}

export default function Book() {
  const [pages, setPages]       = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [flipClass, setFlipClass] = useState(''); // 'page-flip-next' | 'page-flip-prev' | ''
  const bookRef = useRef(null);
  const isAnimating = useRef(false);

  // ── Initial Firestore load ────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const fetched = await getAllPages();
        if (fetched.length === 0) {
          // First-time user — create a starter page locally (saved on first keystroke)
          const starter = blankPage();
          setPages([starter]);
          setCurrentIndex(0);
        } else {
          setPages(fetched);
          setCurrentIndex(0); // Open to the first entry
        }
      } catch (err) {
        console.error('Failed to load pages:', err);
        setError('Could not connect to your diary. Check your Firebase config.');
        // Fallback: single blank page so the UI still renders
        setPages([blankPage()]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ── Navigation ────────────────────────────────────────────────────
  const navigate = useCallback((direction) => {
    if (isAnimating.current) return;

    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex < 0 || newIndex >= pages.length) return;

    isAnimating.current = true;
    const animClass = direction === 'next' ? 'page-flip-next' : 'page-flip-prev';
    setFlipClass(animClass);

    setTimeout(() => {
      setCurrentIndex(newIndex);
      setFlipClass('');
      isAnimating.current = false;
    }, 600); // matches animation duration
  }, [currentIndex, pages.length]);

  // ── Add a new blank page ──────────────────────────────────────────
  const handleAddPage = useCallback(async () => {
    const newPage = blankPage();
    // Pre-create the Firestore doc so it gets the createdAt timestamp
    try {
      await savePage(newPage.id, { date: newPage.date, content: newPage.content });
    } catch (err) {
      console.error('Could not create new page:', err);
    }
    setPages((prev) => [...prev, newPage]);
    // Navigate to the new page with animation
    isAnimating.current = true;
    setFlipClass('page-flip-next');
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setFlipClass('');
      isAnimating.current = false;
    }, 600);
  }, []);

  // ── Sync page updates from PageRight back into local state ────────
  const handlePageUpdate = useCallback((id, updates) => {
    setPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  // ── Keyboard navigation ───────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e) => {
      // Only navigate with Alt+Arrow to avoid conflicting with textarea
      if (e.altKey && e.key === 'ArrowRight') navigate('next');
      if (e.altKey && e.key === 'ArrowLeft')  navigate('prev');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [navigate]);

  // ── Derived values ────────────────────────────────────────────────
  const currentPage  = pages[currentIndex] ?? null;
  const previousPage = pages[currentIndex - 1] ?? null;
  const isFirst      = currentIndex === 0;
  const isLast       = currentIndex === pages.length - 1;

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="relative flex items-center justify-center w-full min-h-screen py-8">

      {/* ── Fixed side nav buttons ── */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50">
        <PageFlipBtn
          direction="prev"
          disabled={isFirst || loading}
          onClick={() => navigate('prev')}
          label="Go to previous page"
        />
      </div>
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50">
        <PageFlipBtn
          direction="next"
          disabled={isLast || loading}
          onClick={() => navigate('next')}
          label="Go to next page"
        />
      </div>

      {/* ── The Book — fills 90% of viewport, max 1400px ── */}
      <div
        ref={bookRef}
        className={`book-container w-[90vw] max-w-[1400px] ${flipClass}`}
        style={{
          filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.55)) drop-shadow(0 10px 24px rgba(0,0,0,0.45))',
        }}
      >
        {/* Outer book wrapper */}
        <div
          className="flex w-full rounded-sm overflow-hidden relative"
          style={{
            height: 'min(84vh, 820px)',
            boxShadow: '0 0 0 2px #4a2318, 0 0 0 4px #6b3a2a, 0 0 0 6px #8b5e3c',
            borderRadius: '2px',
          }}
        >
          {loading ? (
            <div className="w-full bg-[#faf3e0] flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="w-full bg-[#faf3e0] flex flex-col items-center justify-center gap-4 px-12 text-center">
              <span className="text-4xl">📖</span>
              <p
                className="text-[#6b3a2a] text-lg leading-relaxed"
                style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: 'italic' }}
              >
                {error}
              </p>
              <p
                className="text-sm text-[#8b7055]"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                See <code className="bg-[#eedcae]/60 px-1 rounded text-xs not-italic">src/firebase/firebaseConfig.js</code>
              </p>
            </div>
          ) : (
            <>
              {/* Left page */}
              <div className="w-1/2 h-full">
                <PageLeft
                  page={previousPage}
                  pageNum={currentIndex * 2}
                  isFirst={isFirst}
                />
              </div>

              {/* Spine crease */}
              <div
                className="book-spine absolute top-0 bottom-0 pointer-events-none z-10"
                style={{ left: '50%', transform: 'translateX(-50%)', width: '28px' }}
              />

              {/* Right page */}
              <div className="w-1/2 h-full">
                <PageRight
                  page={currentPage}
                  pageNum={currentIndex * 2 + 1}
                  isLast={isLast}
                  onAddPage={handleAddPage}
                  onPageUpdate={handlePageUpdate}
                />
              </div>
            </>
          )}
        </div>

        {/* Book spine thickness illusion */}
        <div
          className="mx-2 h-4 rounded-b-sm"
          style={{
            background: 'linear-gradient(to bottom, #4a2318, #2c1a0e)',
            boxShadow: '0 6px 16px rgba(0,0,0,0.55)',
          }}
        />
      </div>

      {/* Keyboard hint */}
      {!loading && (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 text-[11px] text-white/25 tracking-widest"
          style={{ fontFamily: "'Caveat', cursive" }}
        >
          Alt ← → to flip pages
        </div>
      )}
    </div>
  );
}
