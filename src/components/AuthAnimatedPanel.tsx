import { useState, useRef } from "react";

interface FloatingCard {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  delay: number;
  icon: string;
  label: string;
  detail: string;
  stat: string;
  statLabel: string;
}

const CARDS: FloatingCard[] = [
  { id: 1, x: 15, y: 12, rotation: -8, scale: 1, delay: 0, icon: "🛍️", label: "ショッピング", detail: "50,000+ brands available", stat: "2.4M", statLabel: "products listed" },
  { id: 2, x: 62, y: 8, rotation: 5, scale: 0.9, delay: 0.3, icon: "⭐", label: "ポイント10倍", detail: "Earn 10x points today", stat: "10x", statLabel: "bonus points" },
  { id: 3, x: 8, y: 55, rotation: -4, scale: 0.85, delay: 0.6, icon: "🎯", label: "タイムセール", detail: "Flash deals every hour", stat: "73%", statLabel: "max discount" },
  { id: 4, x: 55, y: 50, rotation: 7, scale: 0.95, delay: 0.9, icon: "📦", label: "送料無料", detail: "Free shipping over ¥3,000", stat: "¥0", statLabel: "shipping fee" },
  { id: 5, x: 35, y: 75, rotation: -3, scale: 0.88, delay: 1.2, icon: "💰", label: "キャッシュバック", detail: "Up to 20% cashback", stat: "20%", statLabel: "cash back" },
  { id: 6, x: 70, y: 72, rotation: 6, scale: 0.82, delay: 1.5, icon: "🎁", label: "ギフト", detail: "Gift wrapping available", stat: "¥500", statLabel: "gift credit" },
];

const OrbitDot = ({ index, total }: { index: number; total: number }) => (
  <div
    className="absolute w-2 h-2 rounded-full bg-[hsl(var(--gold))]"
    style={{
      animation: `orbitSpin 12s linear infinite`,
      animationDelay: `${(index / total) * -12}s`,
      transformOrigin: "150px 150px",
      left: "calc(50% - 4px)",
      top: "calc(50% - 150px)",
    }}
  />
);

export const AuthAnimatedPanel = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleCardClick = (id: number) => {
    setActiveCard(activeCard === id ? null : id);
  };

  return (
    <div
      ref={panelRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-full overflow-hidden cursor-default select-none"
      style={{
        background: `radial-gradient(ellipse at ${mousePos.x}% ${mousePos.y}%, hsl(var(--primary) / 0.15) 0%, transparent 60%), linear-gradient(145deg, hsl(var(--background)) 0%, hsl(var(--accent)) 50%, hsl(var(--background)) 100%)`,
      }}
    >
      <style>{`
        @keyframes orbitSpin {
          from { transform: rotate(0deg) translateX(150px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(150px) rotate(-360deg); }
        }
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0px) rotate(var(--rot)); }
          50% { transform: translateY(-12px) rotate(calc(var(--rot) + 2deg)); }
        }
        @keyframes gridPulse {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.08; }
        }
        @keyframes yenSpin {
          0% { transform: rotate(0deg) scale(1); opacity: 0.06; }
          50% { transform: rotate(180deg) scale(1.1); opacity: 0.12; }
          100% { transform: rotate(360deg) scale(1); opacity: 0.06; }
        }
        @keyframes lineTrace {
          0% { stroke-dashoffset: 800; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes cardEnter {
          from { opacity: 0; transform: translateY(30px) scale(0.8) rotate(var(--rot)); }
          to { opacity: 1; transform: translateY(0) scale(1) rotate(var(--rot)); }
        }
        @keyframes expandReveal {
          from { opacity: 0; max-height: 0; margin-top: 0; }
          to { opacity: 1; max-height: 120px; margin-top: 8px; }
        }
        @keyframes statPop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes ringPulse {
          0% { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.06) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.06) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          animation: "gridPulse 6s ease-in-out infinite",
        }}
      />

      {/* Large background ¥ */}
      <div
        className="absolute text-[280px] font-black text-[hsl(var(--primary))] pointer-events-none"
        style={{
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          animation: "yenSpin 20s linear infinite",
          opacity: 0.06,
        }}
      >
        ¥
      </div>

      {/* Orbit ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-[hsl(var(--primary)/0.1)] pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <OrbitDot key={i} index={i} total={6} />
        ))}
      </div>

      {/* SVG connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.15 }}>
        <path d="M 100,80 Q 250,200 400,120 T 600,300" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" strokeDasharray="800" style={{ animation: "lineTrace 8s linear infinite" }} />
        <path d="M 50,300 Q 200,150 350,280 T 550,100" fill="none" stroke="hsl(var(--gold))" strokeWidth="1" strokeDasharray="800" style={{ animation: "lineTrace 10s linear infinite reverse" }} />
      </svg>

      {/* Interactive floating cards */}
      {CARDS.map((card) => {
        const isHovered = hoveredCard === card.id;
        const isActive = activeCard === card.id;
        const parallaxX = ((mousePos.x - 50) / 50) * 8 * card.scale;
        const parallaxY = ((mousePos.y - 50) / 50) * 8 * card.scale;

        return (
          <div
            key={card.id}
            onMouseEnter={() => setHoveredCard(card.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleCardClick(card.id)}
            className="absolute cursor-pointer transition-all duration-500"
            style={{
              left: `${card.x}%`,
              top: `${card.y}%`,
              "--rot": `${card.rotation}deg`,
              transform: `translate(${parallaxX}px, ${parallaxY}px) scale(${isActive ? 1.2 : isHovered ? 1.1 : card.scale}) rotate(${isActive || isHovered ? 0 : card.rotation}deg)`,
              animation: isActive ? "none" : `cardEnter 0.6s ease-out ${card.delay}s both, cardFloat 4s ease-in-out ${card.delay}s infinite`,
              zIndex: isActive ? 20 : isHovered ? 10 : 1,
            } as React.CSSProperties}
          >
            {/* Pulse ring on click */}
            {isActive && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="absolute w-full h-full rounded-2xl border-2 border-[hsl(var(--primary)/0.4)]"
                  style={{ animation: "ringPulse 1.5s ease-out infinite" }}
                />
              </div>
            )}

            <div
              className={`relative rounded-2xl border backdrop-blur-sm transition-all duration-300 overflow-hidden ${
                isActive
                  ? "bg-card/98 border-[hsl(var(--primary)/0.6)] shadow-[0_12px_48px_hsl(var(--primary)/0.3)]"
                  : isHovered
                  ? "bg-card/95 border-[hsl(var(--primary)/0.5)] shadow-[0_8px_32px_hsl(var(--primary)/0.2)]"
                  : "bg-card/60 border-border/50 shadow-card"
              }`}
            >
              {/* Shimmer effect on active */}
              {isActive && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.08), transparent)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 2s linear infinite",
                  }}
                />
              )}

              {/* Main card content */}
              <div className="flex items-center gap-2.5 px-4 py-3 relative z-10">
                <span className={`text-xl transition-transform duration-300 ${isActive ? "scale-125" : ""}`}>
                  {card.icon}
                </span>
                <span className={`text-xs font-bold whitespace-nowrap transition-colors ${isActive || isHovered ? "text-primary" : "text-foreground/70"}`}>
                  {card.label}
                </span>
                {/* Expand indicator */}
                <span className={`text-[10px] text-muted-foreground/50 transition-all duration-300 ${isActive ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </div>

              {/* Expanded detail panel */}
              {isActive && (
                <div
                  className="px-4 pb-3 relative z-10"
                  style={{ animation: "expandReveal 0.4s ease-out forwards" }}
                >
                  {/* Stat bubble */}
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.7))",
                        animation: "statPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.15s both",
                      }}
                    >
                      <span className="text-sm font-black text-primary-foreground">{card.stat}</span>
                    </div>
                    <div style={{ animation: "statPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.25s both" }}>
                      <p className="text-[10px] font-semibold text-foreground/80 uppercase tracking-wider">{card.statLabel}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{card.detail}</p>
                    </div>
                  </div>

                  {/* Mini progress bar */}
                  <div className="h-1 rounded-full bg-muted/50 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--gold)))",
                        width: "0%",
                        animation: "expandWidth 0.8s ease-out 0.3s forwards",
                      }}
                    />
                  </div>
                  <style>{`@keyframes expandWidth { to { width: ${60 + card.id * 7}%; } }`}</style>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Center brand mark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.7))",
            boxShadow: "0 8px 40px hsl(var(--primary) / 0.3)",
            animation: "cardFloat 6s ease-in-out infinite",
            "--rot": "0deg",
          } as React.CSSProperties}
        >
          <span className="text-3xl font-black text-primary-foreground">¥</span>
        </div>
      </div>

      {/* Bottom tagline */}
      <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
        <p className="text-xs text-muted-foreground/60 tracking-widest uppercase">
          日本最大級のマーケットプレイス
        </p>
      </div>
    </div>
  );
};
