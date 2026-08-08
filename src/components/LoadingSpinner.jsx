/**
 * LoadingSpinner.jsx
 * Ink-drop loading indicator shown while Firestore fetches pages.
 */
export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 h-full select-none">
      {/* Ink-drop animation */}
      <div className="relative w-16 h-16">
        <div
          className="ink-ring absolute inset-0 rounded-full border-2 border-[#8b5e3c]"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="ink-ring absolute inset-0 rounded-full border-2 border-[#8b5e3c]"
          style={{ animationDelay: '0.5s' }}
        />
        {/* Center ink dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-[#6b3a2a] opacity-80" />
        </div>
      </div>

      <p
        className="font-caveat text-xl text-[#6b5243] tracking-widest"
        style={{ fontFamily: "'Caveat', cursive" }}
      >
        Opening your diary…
      </p>
    </div>
  );
}
