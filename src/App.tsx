import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ChevronLeft, ChevronRight, X, Volume2, VolumeX } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION — swap these out with real images
// ─────────────────────────────────────────────────────────────────────────────
const GALLERY_IMAGES = [
  { id: 1,  src: '/prakhar-photos/photo-1.png' },
  { id: 2,  src: '/prakhar-photos/photo-2.png' },
  { id: 3,  src: '/prakhar-photos/photo-3.png' },
  { id: 4,  src: '/prakhar-photos/photo-4.png' },
  { id: 5,  src: '/prakhar-photos/photo-5.png' },
  { id: 6,  src: '/prakhar-photos/photo-6.jpeg' },
  { id: 7,  src: '/prakhar-photos/photo-7.jpeg' },
  { id: 8,  src: '/prakhar-photos/photo-8.jpeg' },
  { id: 9,  src: '/prakhar-photos/photo-9.jpeg' },
  { id: 10, src: '/prakhar-photos/photo-10.jpeg' },
  { id: 11, src: '/prakhar-photos/photo-11.jpeg' },
  { id: 12, src: '/prakhar-photos/photo-12.jpeg' },
  { id: 13, src: '/prakhar-photos/photo-13.jpeg' },
  { id: 14, src: '/prakhar-photos/photo-14.jpeg' },
  { id: 15, src: '/prakhar-photos/photo-15.jpeg' },
  { id: 16, src: '/prakhar-photos/photo-16.jpeg' },
  { id: 17, src: '/prakhar-photos/photo-17.jpeg' },
  { id: 18, src: '/prakhar-photos/photo-18.jpeg' },
  { id: 19, src: '/prakhar-photos/photo-19.jpeg' },
  { id: 20, src: '/prakhar-photos/photo-20.jpeg' },
  { id: 21, src: '/prakhar-photos/photo-21.jpeg' },
  { id: 22, src: '/prakhar-photos/photo-22.jpeg' },
  { id: 23, src: '/prakhar-photos/photo-23.jpeg' },
  { id: 24, src: '/prakhar-photos/photo-24.jpeg' },
  { id: 25, src: '/prakhar-photos/photo-25.jpeg' },
  { id: 26, src: '/prakhar-photos/photo-26.jpeg' },
  { id: 27, src: '/prakhar-photos/photo-27.jpeg' },
  { id: 28, src: '/prakhar-photos/photo-28.jpeg' },
  { id: 29, src: '/prakhar-photos/photo-29.jpeg' },
  { id: 30, src: '/prakhar-photos/photo-30.jpeg' },
  { id: 31, src: '/prakhar-photos/photo-31.jpeg' },
];

// Replace this with your actual Instagram link
const INSTAGRAM_LINK = 'https://www.instagram.com/';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type Page   = 'login' | 'video1' | 'video2' | 'dashboard';
type TabId  = 'gallery' | 'hearts';


// ─────────────────────────────────────────────────────────────────────────────
// HEART IMAGE (your uploaded pixel heart, embedded)
// ─────────────────────────────────────────────────────────────────────────────
const HEART_IMG_SRC = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/4QCnRXhpZgAASUkqAAgAAAADAA4BAgBdAAAAMgAAABoBBQABAAAAjwAAABsBBQABAAAAlwAAAAAAAABQaXhlbCBhcnQgcGluayBoZWFydCBpY29uIHdpdGggYSByZXRybyBhZXN0aGV0aWMgZGVzaWduIG9uIGEgYmxhY2sgYW5kIHRyYW5zcGFyZW50IGJhY2tncm91bmQsAQAAAQAAACwBAAABAAAA/+EF2Gh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyI+Cgk8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgoJCTxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6SXB0YzR4bXBDb3JlPSJodHRwOi8vaXB0Yy5vcmcvc3RkL0lwdGM0eG1wQ29yZS8xLjAveG1sbnMvIiAgIHhtbG5zOkdldHR5SW1hZ2VzR0lGVD0iaHR0cDovL3htcC5nZXR0eWltYWdlcy5jb20vZ2lmdC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBsdXM9Imh0dHA6Ly9ucy51c2VwbHVzLm9yZy9sZGYveG1wLzEuMC8iICB4bWxuczppcHRjRXh0PSJodHRwOi8vaXB0Yy5vcmcvc3RkL0lwdGM0eG1wRXh0LzIwMDgtMDItMjkvIiB4bWxuczp4bXBSaWdodHM9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9yaWdodHMvIiBwaG90b3Nob3A6Q3JlZGl0PSJHZXR0eSBJbWFnZXMiIEdldHR5SW1hZ2VzR0lGVDpBc3NldElEPSIyMTkyOTU4ODc4IiB4bXBSaWdodHM6V2ViU3RhdGVtZW50PSJodHRwczovL3d3dy5pc3RvY2twaG90by5jb20vbGVnYWwvbGljZW5zZS1hZ3JlZW1lbnQ/dXRtX21lZGl1bT1vcmdhbmljJmFtcDt1dG1fc291cmNlPWdvb2dsZSZhbXA7dXRtX2NhbXBhaWduPWlwdGN1cmwiIHBsdXM6RGF0YU1pbmluZz0iaHR0cDovL25zLnVzZXBsdXMub3JnL2xkZi92b2NhYi9ETUktUFJPSElCSVRFRC1FWENFUFRTRUFSQ0hFTkdJTkVJTkRFWElORyIgPgo8ZGM6Y3JlYXRvcj48cmRmOlNlcT48cmRmOmxpPk9rc2FuYSBLYWxhc2hueWtvdmE8L3JkZjpsaT48L3JkZjpTZXE+PC9kYzpjcmVhdG9yPjxkYzpkZXNjcmlwdGlvbj48cmRmOkFsdD48cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiPlBpeGVsIGFydCBwaW5rIGhlYXJ0IGljb24gd2l0aCBhIHJldHJvIGFlc3RoZXRpYyBkZXNpZ24gb24gYSBibGFjayBhbmQgdHJhbnNwYXJlbnQgYmFja2dyb3VuZDwvcmRmOmxpPjwvcmRmOkFsdD48L2RjOmRlc2NyaXB0aW9uPgo8cGx1czpMaWNlbnNvcj48cmRmOlNlcT48cmRmOmxpIHJkZjpwYXJzZVR5cGU9J1Jlc291cmNlJz48cGx1czpMaWNlbnNvclVSTD5odHRwczovL3d3dy5pc3RvY2twaG90by5jb20vcGhvdG8vbGljZW5zZS1nbTIxOTI5NTg4NzgtP3V0bV9tZWRpdW09b3JnYW5pYyZhbXA7dXRtX3NvdXJjZT1nb29nbGUmYW1wO3V0bV9jYW1wYWlnbj1pcHRjdXJsPC9wbHVzOkxpY2Vuc29yVVJMPjwvcmRmOmxpPjwvcmRmOlNlcT48L3BsdXM6TGljZW5zb3I+CgkJPC9yZGY6RGVzY3JpcHRpb24+Cgk8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJ3Ij8+Cv/tAKhQaG90b3Nob3AgMy4wADhCSU0EBAAAAAAAixwCUAATT2tzYW5hIEthbGFzaG55a292YRwCeABdUGl4ZWwgYXJ0IHBpbmsgaGVhcnQgaWNvbiB3aXRoIGEgcmV0cm8gYWVzdGhldGljIGRlc2ln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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADjjjjjmAAAAAABDjjjjjoAAAAAAAAAAAAAAAAAAPvvvvvqgAAAAAFPvvvvvgAAAAAAAAAAAAAAAEDDAwgggggzCKABDAQgggggjjAAAAAAAAAAAAAAAPvgAgggggfqqAFvgwgggggvPgAAAAAAAAAAABAAscQggggghcYYAEMQAgQwwgusSwAAAAAAAAAAFPvwgggggggggllvqAgglQAQggglfqgAAAAAAAAEPvwggggggggglks6QgglAggAAwlfqgAAAAAAAAFPvwgggggggggggggggggglgAKAlfqgAAAAAAAAFPvwgggggggggggggggggglgAKAlfqgAAAAAAAAFPvwggggggggggggggggggkwAAwlfqgAAAAAAAAFPvwggggggggggggggggggggggglfqgAAAAAAAAEAAjDAgggggggggggggggggggrjIwAAAAAAAAAAAAAPvgAggggggggggggggggggvPgAAAAAAAAAAAAABMMAwiAggggggggggggggwgssAAAAAAAAAAAAAAAAAPvqQggggggggggggggvvgAAAAAAAAAAAAAAAAAAMsowRQgggggggggggQMsiAAAAAAAAAAAAAAAAAAAAFPqgggggggggglfqgAAAAAAAAAAAAAAAAAAAAAAFPqgggggggggglfqgAAAAAAAAAAAAAAAAAAAAAAIAFTnAgggggpziwAAAAAAAAAAAAAAAAAAAAAAAAAAFPvQggggglvqgAAAAAAAAAAAAAAAAAAAAAAAAAAAAEjXawpjRgEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPvqwlflAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMMKgssGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFPvgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFMsgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/xAAhEQABBAIDAQADAAAAAAAAAAABABExYTBAECBxUCFRgP/aAAgBAwEBPxD+aAYO6tVqtVqtR2B7ic6tVqtVqtVqAcNODtLmJtAhMF5LyQDBuxzgvJeXLWLyTo/A3i9l78noLyRRjmgzQ9J+BPWDNBkpKpKEgAegEkAqSg7BV4V4QIIccQZoNQxzFxBmg1DHMXEGaDVrCrCAADDiDNBswZiE4XkvJAuH1D0F5Io50YNSbTAgzKtBaZz+FWq0A4fEIHYYhKsUoxgByrEWJ2pHHPuSOOfcBIhXIxD89zIZlciRk70PxwhOOoF4fFEDiX4rP0mfpP8A/OT/xAAeEQACAgIDAQEAAAAAAAAAAAABEQAxQFAQIDCAIf/aAAgBAgEBPxD5oXYBHcDuARkmvYbwVF3MUXIEUAXB/IkTkiKEewv2FdDWKF+iigroaiMUYjGCF44rAC8cVgBeKhEMEL1Bx4pMcJ0pvDfAYQTiitODGPViMaUa041nC+50AvUGYzyTGYTpTenCfnL/xAArEAABAgMHBAMBAQEBAAAAAAABAPARIFEhMWFxocHRMEBQsUGR8WCBoOH/2gAIAQEAAT8Q/wCEgxl+kMCARtwWK3NYrc1itzWK3NYrc1itzWK3NYrc1itzWK3NYrc1itzWOdNhJjG3DqnvEQj6WK3NYrc1itzWK3NYrc1itzWK3NYrc1itzWK3NYrc1itzWK3NUi6FCA7+Fcq+q5V6pop1tc8LOVfVcq9U0U62ueFnKvquVeqaKdbXPAQSmRjwMBMNCnHBOOCccE44KDiuiBwkMwQn45T8cp+OU/HKfjlPxyn45T8cp+OU/HKfjlPxyiJV+EExAhmE44JxwTjgn3BAABiCIgyEBthf3IRuzCccE44JxwRsQAAjaSMk/HKfjlPxyn45T8cp+OU/HKfjlPxyn45T8cp+OU/HKt9yIjBCNmIKccE44JxwQCVx4xIYAXeBTvtPVfaCS4zWn+pNFJ6T762jyDtT4FO+09V9oJLjNaf6k0UnpPvraPIO1PgU77T1X2gkuM1p/qTRSek++to8g7U+BTvtPVfaCS4zWn+pNFJ6T762jyDtT3BrxoNAA2WwTl2Tl2Tl2RCZhMgJAGOAk4N04N04N04N0E2AYyYwAEB1QPwyY2COWScG6cG6cG6gCIsGXoqClgpj/E5dk5dk5dlH0TDYfIj8I3E4N04N04N0HBEBiP0lOxiSEIGCx/2WP+yx/wBkExxBEWpY87cSxEn4zTg3Tg3Tg3R8ekIAokDfaAnLsnLsnLsnLshBUhDYArhmezeKu6wG8tU99UGjSap66LBV3GR4q7rAby1T31QaNJqnrosFXcZHirusBvLVPfVBo0mqeuiwVdxkeKu6gG4oFjgSI/VYxuKxjcVjG4oDE0cYwjG449EBRxIhYmwU2CmwVGKgIAgb02QmyE2QmyEGRQiItkYKu4yPFXjMGie5X+JkYKu4yPFXjMGie5X+JkYKu4yPFXjMGie5X+JkYKu4yPFXjMGie5X+JkYKu4yPFXjMAJAF4MQsV9BYr6CxX0FivoIMigEBZIwVdxkeKvK4GCruMjxV5XAwVdxkeKvK4GCruMhrxoFEE2WRTl3Tl3Tl3RCZhMiZACFq4k4Nk4Nk4Nk4NkU2IZyIRBER4iHK3EsRI+Mk4Nk4Nk4NkfHpCAKBE3WkJy7py7py7py7oRVIA2gC8ZHvE77T4jR5B2p8CnfafEaPIO1PgU77T4jR5B2p8CnfafEaPIO1PeBKZG7EBEdSvxTyvxTyvxTyvxTyiljoEDgAZABfthfthfthQ4jw7jB35MRaD4IBX7YX7YX7YX7YXyyERBGFmJP2vxTyvxTyvxTyggjjxiAxBv8AAuVcjTB37HVLrnhZyrkaYO/Y6pdc8LOVcjTB37HVLrnhYRl2kMCERsxWC3JYLclgtyVaWA4gssgE0PKaHlNDymh5UceCCND21tfVo2D/AFNDymh5TQ8q21KyBcCNtSsFuSwW5LBbksFuSpF0KEA28SwxysNB2zNWR2o8cwxysNB2zNWR2o8cwxysNB2zNWR2o8cwxysNB2zNWR2o8dAaWCANbU8Nk8Nk8Nk8NkNyG0ABIACZG6ZG6ZG6FAjwPBaa9UyUDAgoH/EyN0yN0yN0yN1HXRACQYgRuTw2Tw2Tw2RcFgARBFxu8m91SOtT1dT9StNXl3uqR1qerqfqVpq8u91SOtT1dT9StNXlxZ4aDHgTGQiRIgwJhGSBtGNisqRIkyAGFxEZC4/GyDCEL4kVkSJEhHIOwRgRNkpEiRIomuACAACLYgebcqSBeFpnqTQSDFX+AcqSBeFpnqTQSDFX+AcqSBeFpnqTQSDFX+AcqSBeFpnqTQSDFX+AFgHtgCHKKZ+yZ+yZ+yiVF9iBRgEABYW5p7bp7bp7boZRuX9qFqEYD6TP2TP2TP2QGQQEi4/+f8JeZLUfcmo/iO8yWo+5NR/Ed5ktR9yaj+IyIghA+KIWBOnZOnZOnZBg+A0iFq+Of/Ad/9k=";

// ─────────────────────────────────────────────────────────────────────────────
// PIXEL CURSOR
// ─────────────────────────────────────────────────────────────────────────────
function PixelCursor() {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      * { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cpath d='M0 0v16l4-4 3 7 3-1-3-7 5-1z' fill='%23FF69B4' stroke='%23c2185b' stroke-width='1.5'/%3E%3C/svg%3E"), auto !important; }
      button, a, [role=button] { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cpath d='M10 0h2v2h-2zM8 2h2v2H8zM12 2h2v2h-2zM6 4h2v2H6zM14 4h2v2h-2zM6 6h2v8H6zM14 6h2v8h-2zM6 14h2v2H6zM14 14h2v2h-2zM8 16h2v2H8zM12 16h2v2h-2zM10 18h2v6h-2z' fill='%23FF69B4' stroke='%23c2185b' stroke-width='0.5'/%3E%3C/svg%3E"), pointer !important; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// SPARKLE RAIN
// ─────────────────────────────────────────────────────────────────────────────
function SparkleRain() {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const colors = ['#FF69B4', '#a78bfa', '#67e8f9', '#fde68a', '#f9a8d4'];
  useEffect(() => {
    const iv = setInterval(() => {
      setSparkles(p => [
        ...p.slice(-12),
        { id: Date.now(), x: Math.random() * 100, y: Math.random() * 100, color: colors[Math.floor(Math.random() * colors.length)] },
      ]);
    }, 700);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {sparkles.map(s => (
          <motion.span
            key={s.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.4, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1.6 }}
            style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, color: s.color, fontSize: 14, lineHeight: 1 }}
          >✦</motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GLOSSY BUTTON
// ─────────────────────────────────────────────────────────────────────────────
function GlossyBtn({
  children, onClick, variant = 'pink', className,
}: {
  children: React.ReactNode; onClick?: () => void;
  variant?: 'pink' | 'cyan'; className?: string;
}) {
  const v = {
    pink: 'bg-[#FF69B4] shadow-[0_4px_0_#c2185b] hover:bg-[#ff85c0] text-white',
    cyan: 'bg-cyan-400 shadow-[0_4px_0_#00acc1] hover:bg-cyan-300 text-slate-900',
  };
  return (
    <button onClick={onClick} className={cn(
      'relative overflow-hidden px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-200 active:scale-95 cursor-pointer',
      v[variant], className,
    )}>
      <div className="absolute top-1 left-3 right-3 h-1/3 bg-white/30 rounded-full blur-sm pointer-events-none" />
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RADIAL XP RING (floating, non-blocking)
// ─────────────────────────────────────────────────────────────────────────────
function XpRing({ xp }: { xp: number }) {
  const max = 100;
  const pct = Math.min(xp / max, 1);
  const r = 20, circ = 2 * Math.PI * r;
  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col items-center" style={{ filter: 'drop-shadow(0 2px 8px #FF69B4aa)' }}>
      <svg width="58" height="58" viewBox="0 0 58 58">
        <circle cx="29" cy="29" r={r} fill="rgba(255,255,255,0.15)" stroke="rgba(255,105,180,0.2)" strokeWidth="5" />
        <motion.circle
          cx="29" cy="29" r={r} fill="none"
          stroke="url(#xpg)" strokeWidth="5" strokeLinecap="round"
          strokeDasharray={circ}
          animate={{ strokeDashoffset: circ - pct * circ }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          transform="rotate(-90 29 29)"
        />
        <defs>
          <linearGradient id="xpg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF69B4" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        <text x="29" y="25" textAnchor="middle" fontSize="6" fill="#FF69B4" fontFamily="Silkscreen,monospace" fontWeight="bold">LOVE</text>
        <text x="29" y="36" textAnchor="middle" fontSize="9" fill="white" fontFamily="Silkscreen,monospace" fontWeight="bold">{xp}</text>
      </svg>
      <span style={{ fontFamily: 'Silkscreen', fontSize: 7, color: '#FF69B4', letterSpacing: 2 }}>XP</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(onLogin, 2200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-20 flex items-center justify-center p-4 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 30%, #e1bee7 65%, #b3e5fc 100%)' }}
    >
      {/* Floating hearts background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(16)].map((_, i) => (
          <motion.img
            key={i}
            src={HEART_IMG_SRC}
            alt=""
            animate={{ y: [0, -18, 0], opacity: [0.15, 0.4, 0.15] }}
            transition={{ duration: 3 + i * 0.35, repeat: Infinity, delay: i * 0.28, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              left: `${(i * 7 + 4) % 95}%`,
              top: `${(i * 11 + 8) % 88}%`,
              width: 28 + (i % 4) * 10,
              height: 28 + (i % 4) * 10,
              objectFit: 'contain',
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ y: 28, opacity: 0, scale: 0.94 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 220 }}
        className="relative w-full max-w-md overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.58)',
          backdropFilter: 'blur(22px)',
          borderRadius: 30,
          border: '4px solid rgba(255,255,255,0.85)',
          boxShadow: '0 8px 48px rgba(255,105,180,0.28), inset 0 2px 0 rgba(255,255,255,0.9)',
          padding: '42px 38px',
        }}
      >
        <div className="absolute top-0 left-6 right-6 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)' }} />

        <div className="text-center mb-8">
          <motion.img
            src={HEART_IMG_SRC}
            alt="heart"
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="w-16 h-16 object-contain mx-auto mb-3"
          />
          <h1 style={{ fontFamily: 'Silkscreen, monospace', fontSize: 22, color: '#FF69B4', textShadow: '2px 2px 0 rgba(194,24,91,0.25)', letterSpacing: 1 }}>
            BIRTHDAY UNIVERSE
          </h1>
          <p style={{ fontFamily: 'Silkscreen', fontSize: 8, color: '#a78bfa', letterSpacing: 3, marginTop: 6 }}>
            EST. 2001 · v25.0
          </p>
        </div>

        {loading ? (
          <div className="space-y-5 py-4 text-center">
            <motion.p
              animate={{ opacity: [1, 0.35, 1] }}
              transition={{ repeat: Infinity, duration: 0.9 }}
              style={{ fontFamily: 'Silkscreen', color: '#FF69B4', fontSize: 10, letterSpacing: 2 }}
            >
              INITIALIZING BIRTHDAY PROTOCOL...
            </motion.p>
            <div className="h-6 w-full rounded-full overflow-hidden border-4 border-[#FF69B4] bg-white/50 p-1">
              <motion.div
                initial={{ width: 0 }} animate={{ width: '100%' }}
                transition={{ duration: 2, ease: 'easeInOut' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #FF69B4, #a78bfa, #67e8f9)' }}
              />
            </div>
            <div className="flex justify-center gap-3 pt-1">
              {['💝', '✨', '🌸'].map((e, i) => (
                <motion.span key={i} animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.18 }} style={{ fontSize: 20 }}>
                  {e}
                </motion.span>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label style={{ fontFamily: 'Silkscreen', fontSize: 9, letterSpacing: 2, color: '#FF69B4', textTransform: 'uppercase', display: 'block', marginLeft: 4 }}>
                Username
              </label>
              <input
                type="text" placeholder="emprakhar" required
                className="w-full px-5 py-3 rounded-2xl border-4 border-[#FF69B4] bg-white/75 focus:outline-none focus:border-[#a78bfa] transition-all font-semibold text-slate-700"
              />
            </div>
            <div className="space-y-1.5">
              <label style={{ fontFamily: 'Silkscreen', fontSize: 9, letterSpacing: 2, color: '#FF69B4', textTransform: 'uppercase', display: 'block', marginLeft: 4 }}>
                Password
              </label>
              <input
                type="password" placeholder="••••••••" required
                className="w-full px-5 py-3 rounded-2xl border-4 border-[#FF69B4] bg-white/75 focus:outline-none focus:border-[#a78bfa] transition-all font-semibold text-slate-700"
              />
            </div>
            <GlossyBtn className="w-full mt-4">Enter Birthday Universe ✨</GlossyBtn>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VIDEO SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function VideoScreen({ videoNum, onSkip }: { videoNum: 1 | 2; onSkip: () => void }) {
  const vidRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showUnmuteHint, setShowUnmuteHint] = useState(false);

  const src = videoNum === 1
    ? '/videos/video1.mp4'
    : '/videos/video2.mp4';

  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;
    // Try unmuted first — browsers may block this
    v.muted = false;
    v.play().catch(() => {
      // Browser blocked unmuted autoplay, fall back to muted + show hint
      v.muted = true;
      setIsMuted(true);
      setShowUnmuteHint(true);
      v.play().catch(() => {});
    });
    const onEnd = () => onSkip();
    v.addEventListener('ended', onEnd);
    return () => v.removeEventListener('ended', onEnd);
  }, [onSkip]);

  const toggleMute = () => {
    const v = vidRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
    setShowUnmuteHint(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-30 bg-black flex items-center justify-center"
    >
      <video ref={vidRef} src={src} className="w-full h-full object-cover" playsInline autoPlay />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.45) 100%)' }} />

      {/* Tap to unmute — only shown if browser blocked audio */}
      <AnimatePresence>
        {showUnmuteHint && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={toggleMute}
            className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer"
            style={{ background: 'transparent', border: 'none' }}
          >
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              style={{
                background: 'rgba(0,0,0,0.65)',
                backdropFilter: 'blur(12px)',
                border: '2px solid rgba(255,105,180,0.6)',
                borderRadius: 24,
                padding: '20px 40px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 10 }}>🔊</div>
              <p style={{ fontFamily: 'Silkscreen', fontSize: 11, color: '#FF69B4', letterSpacing: 2 }}>
                TAP TO UNMUTE
              </p>
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sound toggle (always top-right) */}
      <button
        onClick={toggleMute}
        className="absolute top-5 right-20 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform z-10"
        style={{
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)',
          border: '2px solid rgba(255,255,255,0.25)',
          color: 'white',
        }}
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>

      {/* Skip button */}
      <motion.button
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
        onClick={onSkip}
        className="absolute bottom-10 right-8 flex items-center gap-2 cursor-pointer z-10"
        style={{
          background: 'rgba(255,105,180,0.88)', backdropFilter: 'blur(8px)',
          border: '2px solid rgba(255,255,255,0.45)', borderRadius: 40,
          color: 'white', padding: '10px 22px',
          fontFamily: 'Silkscreen', fontSize: 10, letterSpacing: 3,
          boxShadow: '0 4px 20px rgba(255,105,180,0.5)',
        }}
      >
        SKIP <ChevronRight size={13} />
      </motion.button>

      <div className="absolute top-5 left-6" style={{ fontFamily: 'Silkscreen', fontSize: 8, color: 'rgba(255,255,255,0.5)', letterSpacing: 3 }}>
        VIDEO {videoNum} / 2
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FULLSCREEN LIGHTBOX (with prev/next)
// ─────────────────────────────────────────────────────────────────────────────
function Lightbox({
  images, startIndex, onClose,
}: {
  images: typeof GALLERY_IMAGES; startIndex: number; onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);
  const img = images[idx];

  const prev = useCallback(() => setIdx(i => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIdx(i => (i + 1) % images.length), [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prev, next, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      {/* Prev */}
      <button
        onClick={e => { e.stopPropagation(); prev(); }}
        className="absolute left-4 md:left-8 z-10 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
        style={{ background: 'rgba(255,105,180,0.7)', border: '2px solid rgba(255,255,255,0.3)', color: 'white' }}
      >
        <ChevronLeft size={22} />
      </button>

      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.92, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.92, x: -30 }}
          transition={{ duration: 0.22 }}
          onClick={e => e.stopPropagation()}
          className="relative max-w-[85vw] max-h-[88vh] flex flex-col items-center"
          style={{
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 20,
            border: '3px solid rgba(255,105,180,0.3)',
            padding: '14px 14px 10px',
            boxShadow: '0 0 60px rgba(255,105,180,0.25)',
          }}
        >
          <img
            src={img.src} alt=""
            className="block max-w-full max-h-[82vh] rounded-xl object-contain"
            style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}
          />
          <p style={{ fontFamily: 'Silkscreen', fontSize: 8, color: 'rgba(255,105,180,0.6)', letterSpacing: 1, marginTop: 8 }}>
            {idx + 1} / {images.length}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Next */}
      <button
        onClick={e => { e.stopPropagation(); next(); }}
        className="absolute right-4 md:right-8 z-10 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
        style={{ background: 'rgba(255,105,180,0.7)', border: '2px solid rgba(255,255,255,0.3)', color: 'white' }}
      >
        <ChevronRight size={22} />
      </button>

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
        style={{ background: 'rgba(255,255,255,0.12)', border: '2px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}
      >
        <X size={18} />
      </button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GALLERY TAB
// ─────────────────────────────────────────────────────────────────────────────
function GalleryTab({ onOpenLightbox }: { onOpenLightbox: (idx: number) => void }) {
  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 style={{ fontFamily: 'Silkscreen', fontSize: 26, color: '#FF69B4', letterSpacing: 2, textShadow: '2px 2px 0 rgba(194,24,91,0.2)' }}>
          you ✨
        </h2>
        
      </div>

      {/* Masonry-style polaroid grid */}
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4 px-1">
        {GALLERY_IMAGES.map((img, i) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            whileHover={{ scale: 1.03, zIndex: 10, rotate: 0 }}
            onClick={() => onOpenLightbox(i)}
            className="break-inside-avoid cursor-zoom-in mb-4"
            style={{
              transform: `rotate(${i % 2 === 0 ? -1.5 : 1.8}deg)`,
              transformOrigin: 'center',
            }}
          >
            {/* Polaroid frame */}
            <div
              className="relative group"
              style={{
                background: 'white',
                borderRadius: 6,
                padding: '10px 10px 10px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)',
                border: '1px solid rgba(255,255,255,0.9)',
                transition: 'box-shadow 0.2s ease',
              }}
            >
              {/* Photo area */}
              <div className="overflow-hidden" style={{ borderRadius: 3, background: '#f3f3f3' }}>
                <img
                  src={img.src}
                  alt=""
                  className="w-full block object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ display: 'block' }}
                  loading="lazy"
                />
              </div>



              {/* Heart sticker on hover */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className="absolute -top-3 -right-3 pointer-events-none"
              >
                <img src={HEART_IMG_SRC} alt="" className="w-8 h-8 object-contain" style={{ filter: 'drop-shadow(0 2px 4px rgba(255,105,180,0.6))' }} />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 25 HEARTS TAB (permanently locked)
// ─────────────────────────────────────────────────────────────────────────────
function HeartsTab() {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center py-8 px-4">
      <div className="text-center mb-10">
        <h2 style={{ fontFamily: 'Silkscreen', fontSize: 20, color: '#FF69B4', letterSpacing: 2 }}>
          25 Hearts 💖
        </h2>
        
      </div>

      {/* 5×5 locked heart grid */}
      <div className="grid grid-cols-5 gap-3 max-w-xs mx-auto mb-10">
        {Array.from({ length: 25 }, (_, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-1"
            style={{ opacity: 0.28, filter: 'grayscale(0.6)' }}
          >
            <img
              src={HEART_IMG_SRC}
              alt="locked heart"
              className="w-10 h-10 object-contain select-none pointer-events-none"
            />
          </div>
        ))}
      </div>

      {/* Lock message */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
        className="text-center"
        style={{
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(12px)',
          borderRadius: 20,
          border: '3px solid rgba(255,105,180,0.3)',
          padding: '20px 36px',
          boxShadow: '0 4px 24px rgba(255,105,180,0.15)',
        }}
      >
        <p style={{ fontFamily: 'Silkscreen', fontSize: 11, color: '#FF69B4', letterSpacing: 2, lineHeight: 1.8 }}>
          Come to Insti<br />to unlock 💌
        </p>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
const TABS: { id: TabId; label: string; emoji: string }[] = [
  { id: 'gallery', label: 'you',      emoji: '📸' },
  { id: 'hearts',  label: '25 hearts', emoji: '💖' },
];

function Dashboard({
  xp, isMuted, setIsMuted,
}: {
  xp: number; isMuted: boolean; setIsMuted: (v: boolean) => void;
}) {
  const [activeTab, setActiveTab] = useState<TabId>('gallery');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="min-h-screen"
      style={{ background: 'linear-gradient(155deg, #fce4ec 0%, #fdf2f8 30%, #ede7f6 65%, #e8f4fd 100%)' }}
    >
      {/* Soft checkered overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04]" style={{
        backgroundImage: 'linear-gradient(45deg,#FF69B4 25%,transparent 25%),linear-gradient(-45deg,#FF69B4 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#FF69B4 75%),linear-gradient(-45deg,transparent 75%,#FF69B4 75%)',
        backgroundSize: '36px 36px',
        backgroundPosition: '0 0,0 18px,18px -18px,-18px 0',
      }} />

      {/* Top bar */}
      <header className="sticky top-0 z-30" style={{
        background: 'rgba(255,245,250,0.82)',
        backdropFilter: 'blur(16px)',
        borderBottom: '2px solid rgba(255,105,180,0.12)',
        boxShadow: '0 2px 16px rgba(255,105,180,0.08)',
      }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo / title */}
          <div className="flex items-center gap-2.5">
            <img src={HEART_IMG_SRC} alt="" className="w-7 h-7 object-contain" />
            <span style={{ fontFamily: 'Silkscreen', fontSize: 11, color: '#FF69B4', letterSpacing: 2 }}>
              BIRTHDAY UNIVERSE
            </span>
          </div>

          {/* Tabs */}
          <nav className="flex gap-1 bg-white/60 p-1 rounded-full border-2 border-[#FF69B4]/20" style={{ backdropFilter: 'blur(8px)' }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="cursor-pointer transition-all duration-200"
                style={{
                  padding: '7px 18px',
                  borderRadius: 40,
                  fontFamily: 'Silkscreen',
                  fontSize: 9,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  background: activeTab === tab.id ? '#FF69B4' : 'transparent',
                  color: activeTab === tab.id ? 'white' : '#FF69B4',
                  boxShadow: activeTab === tab.id ? '0 3px 12px rgba(255,105,180,0.4), inset 0 1px 0 rgba(255,255,255,0.3)' : 'none',
                  border: 'none',
                  outline: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.emoji} {tab.label}
              </button>
            ))}
          </nav>

          {/* Sound toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform flex-shrink-0"
            style={{
              background: 'rgba(255,255,255,0.7)',
              border: '2px solid rgba(255,105,180,0.3)',
              color: '#FF69B4',
              boxShadow: '0 2px 10px rgba(255,105,180,0.15)',
            }}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 pb-24">
        <AnimatePresence mode="wait">
          {activeTab === 'gallery' && (
            <motion.div key="gallery" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <GalleryTab onOpenLightbox={(idx) => setLightboxIdx(idx)} />
            </motion.div>
          )}
          {activeTab === 'hearts' && (
            <motion.div key="hearts" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <HeartsTab />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 pb-20">
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          style={{ fontFamily: 'Silkscreen', fontSize: 9, color: '#FF69B4', letterSpacing: 3 }}
        >
          made with 💖 by your player 2
        </motion.p>
      </footer>

      {/* XP Ring (floating, bottom-right, only relevant in hearts tab context) */}
      <XpRing xp={xp} />

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox
            key="lightbox"
            images={GALLERY_IMAGES}
            startIndex={lightboxIdx}
            onClose={() => setLightboxIdx(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>('login');
  const [xp]           = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
    audioRef.current.loop = true;
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isMuted) audioRef.current.pause();
    else audioRef.current.play().catch(() => {});
  }, [isMuted]);

  useEffect(() => {
    if (page === 'dashboard') {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#FF69B4', '#a78bfa', '#67e8f9', '#fde68a'] });
    }
  }, [page]);

  return (
    <div style={{ fontFamily: 'Nunito, sans-serif' }}>
      <PixelCursor />
      <SparkleRain />

      <AnimatePresence mode="wait">
        {page === 'login'     && <LoginScreen key="login"  onLogin={() => setPage('video1')} />}
        {page === 'video1'    && <VideoScreen key="v1" videoNum={1} onSkip={() => setPage('video2')} />}
        {page === 'video2'    && <VideoScreen key="v2" videoNum={2} onSkip={() => setPage('dashboard')} />}
        {page === 'dashboard' && <Dashboard  key="dash" xp={xp} isMuted={isMuted} setIsMuted={setIsMuted} />}
      </AnimatePresence>
    </div>
  );
}
