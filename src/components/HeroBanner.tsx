import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronLeft, ChevronRight, Zap, Tag } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const slideConfigs = [
  {
    badgeKey: "hero.badge1",
    badgeIcon: Sparkles,
    titleKey: "hero.title1",
    subtitleKey: "hero.sub1",
    ctaKey: "hero.cta1",
    ctaLink: "/search?q=",
    image: heroSlide1,
  },
  {
    badgeKey: "hero.badge2",
    badgeIcon: Zap,
    titleKey: "hero.title2",
    subtitleKey: "hero.sub2",
    ctaKey: "hero.cta2",
    ctaLink: "/category/electronics",
    image: heroSlide2,
  },
  {
    badgeKey: "hero.badge3",
    badgeIcon: Tag,
    titleKey: "hero.title3",
    subtitleKey: "hero.sub3",
    ctaKey: "hero.cta3",
    ctaLink: "/category/fashion",
    image: heroSlide3,
  },
];

export const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slideConfigs.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index: number) => setCurrent(index);
  const goPrev = () => setCurrent((prev) => (prev - 1 + slideConfigs.length) % slideConfigs.length);
  const goNext = () => setCurrent((prev) => (prev + 1) % slideConfigs.length);

  const slide = slideConfigs[current];

  // Preload all slides so arrow clicks swap instantly
  useEffect(() => {
    slideConfigs.forEach((s) => {
      const img = new Image();
      img.src = s.image;
    });
  }, []);

  return (
    <section className="relative overflow-hidden group">
      <div className="relative w-full h-[340px] sm:h-[400px] lg:h-[480px]">
        {slideConfigs.map((s, i) => (
          <img
            key={i}
            src={s.image}
            alt="Marketplace sale"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${i === current ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        {/* Mobile-only legibility scrim */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/20 to-transparent sm:from-black/25 sm:via-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container">
          <div key={current} className="max-w-lg animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-card/25 backdrop-blur-md text-primary-foreground px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4 border border-primary-foreground/30">
              <slide.badgeIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {t(slide.badgeKey)}
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-primary-foreground leading-tight mb-2 sm:mb-3 whitespace-pre-line drop-shadow-lg">
              {t(slide.titleKey)}
            </h1>
            <p className="text-primary-foreground/95 text-xs sm:text-base mb-4 sm:mb-6 max-w-md drop-shadow">
              {t(slide.subtitleKey)}
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Link to={slide.ctaLink}>
                <Button className="font-bold bg-card text-foreground hover:bg-card/90 shadow-lg h-10 sm:h-11 px-5 sm:px-8 text-sm sm:text-base">
                  {t(slide.ctaKey)}
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="font-bold bg-primary-foreground/25 backdrop-blur-md text-primary-foreground border border-primary-foreground/70 hover:bg-primary-foreground hover:text-primary shadow-lg h-10 sm:h-11 px-5 sm:px-8 text-sm sm:text-base">
                  {t("hero.join")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={goPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/20 backdrop-blur-md text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card/40 border border-primary-foreground/20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={goNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/20 backdrop-blur-md text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card/40 border border-primary-foreground/20"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slideConfigs.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-primary-foreground" : "w-2 bg-primary-foreground/40 hover:bg-primary-foreground/60"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
