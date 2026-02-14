'use client';

const HEARTS = 18;
const positions = Array.from({ length: HEARTS }, (_, i) => ({
  left: `${5 + (i * 5.5) % 90}%`,
  top: `${(i * 7) % 85}%`,
  delay: `${(i * 0.4) % 3}s`,
  duration: `${4 + (i % 3)}s`,
  size: 14 + (i % 3) * 4,
  opacity: 0.15 + (i % 4) * 0.08,
}));

export default function FloatingHearts() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden
    >
      {positions.map((p, i) => (
        <span
          key={i}
          className="absolute text-pastel-pink-300 animate-float-heart"
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.duration,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
          }}
        >
          ♥
        </span>
      ))}
    </div>
  );
}
