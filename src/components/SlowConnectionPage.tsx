import { useEffect, useState, useRef } from "react";

const YenSymbol = ({ delay, x, y, size }: { delay: number; x: number; y: number; size: number }) => {
  return (
    <div
      className="absolute text-[hsl(var(--gold))] opacity-0 pointer-events-none select-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        fontSize: `${size}px`,
        fontWeight: 900,
        animation: `yenFloat 3s ease-in-out ${delay}s infinite`,
      }}
    >
      ¥
    </div>
  );
};

const PulsingRing = ({ delay, size }: { delay: number; size: number }) => (
  <div
    className="absolute rounded-full border-2 border-[hsl(var(--primary)/0.3)] opacity-0"
    style={{
      width: size,
      height: size,
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      animation: `ringPulse 2.5s ease-out ${delay}s infinite`,
    }}
  />
);

const LoadingDot = ({ delay }: { delay: number }) => (
  <div
    className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--gold))]"
    style={{ animation: `dotBounce 1.4s ease-in-out ${delay}s infinite` }}
  />
);

export const SlowConnectionPage = ({ onDismiss }: { onDismiss: () => void }) => {
  const yenPositions = [
    { x: 10, y: 15, size: 28, delay: 0 },
    { x: 85, y: 20, size: 22, delay: 0.5 },
    { x: 20, y: 75, size: 18, delay: 1 },
    { x: 75, y: 70, size: 32, delay: 1.5 },
    { x: 50, y: 10, size: 20, delay: 0.8 },
    { x: 15, y: 45, size: 24, delay: 1.2 },
    { x: 90, y: 50, size: 16, delay: 0.3 },
    { x: 45, y: 85, size: 26, delay: 1.8 },
  ];

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center overflow-hidden">
      <style>{`
        @keyframes yenFloat {
          0%, 100% { opacity: 0.15; transform: translateY(0px) rotate(0deg); }
          50% { opacity: 0.35; transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes ringPulse {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0.4); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Floating ¥ symbols */}
      {yenPositions.map((p, i) => (
        <YenSymbol key={i} {...p} />
      ))}

      {/* Pulsing rings */}
      <PulsingRing delay={0} size={120} />
      <PulsingRing delay={0.8} size={120} />
      <PulsingRing delay={1.6} size={120} />

      {/* Main content */}
      <div className="relative flex flex-col items-center gap-8 px-6 text-center" style={{ animation: "slideInUp 0.8s ease-out" }}>
        {/* Animated ¥ hero */}
        <div
          className="text-8xl md:text-9xl font-black select-none"
          style={{
            background: "linear-gradient(135deg, hsl(var(--gold)), hsl(var(--primary)), hsl(var(--gold)))",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "shimmer 3s linear infinite, breathe 4s ease-in-out infinite",
            filter: "drop-shadow(0 0 30px hsl(var(--gold) / 0.3))",
          }}
        >
          ¥
        </div>

        {/* Text */}
        <div className="space-y-3" style={{ animation: "slideInUp 0.8s ease-out 0.2s both" }}>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            オフライン
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-sm">
            インターネット接続が見つかりません。接続を確認してください。
          </p>
          <p className="text-muted-foreground/70 text-xs">No internet connection — please check your network</p>
        </div>

        {/* Loading dots */}
        <div className="flex gap-3" style={{ animation: "slideInUp 0.8s ease-out 0.4s both" }}>
          <LoadingDot delay={0} />
          <LoadingDot delay={0.2} />
          <LoadingDot delay={0.4} />
        </div>

        {/* Retry button */}
        <button
          onClick={onDismiss}
          className="mt-4 px-8 py-3 rounded-full bg-[hsl(var(--gold))] text-[hsl(var(--gold-foreground))] font-bold text-sm tracking-wide hover:scale-105 transition-transform duration-200 shadow-lg"
          style={{
            animation: "slideInUp 0.8s ease-out 0.6s both",
            boxShadow: "0 4px 20px hsl(var(--gold) / 0.3)",
          }}
        >
          再読み込み
        </button>
      </div>
    </div>
  );
};
