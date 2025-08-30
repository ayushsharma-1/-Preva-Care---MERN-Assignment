import { useEffect, useMemo, useRef, useState } from "react";

const FEATURES = [
  {
    id: 1,
    title: "Feature 1 : Remote Consultation",
    heading: "See a doctor from anywhere",
    body:
      "Start a secure video visit in minutes. Share symptoms and photos. Get prescriptions and care plans without clinic wait times.",
    imageUrl:
      "https://images.unsplash.com/photo-1491933382434-500287f9b54a?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Feature 2 : Medication Reminders",
    heading: "Never miss a dose again",
    body:
      "Smart schedules adapt to your routine. Gentle nudges across devices. Track adherence and share with your clinician.",
    imageUrl:
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Feature 3 : Unified Health Records",
    heading: "All your reports in one place",
    body:
      "Upload lab results and prescriptions. Import from hospitals securely. Search and share files with one tap.",
    imageUrl:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Feature 4 : Symptom Checker (AI)",
    heading: "Guidance before your visit",
    body:
      "Answer a few questions to get likely causes. Triage urgency and next steps. Prepared notes for faster consults.",
    imageUrl:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Feature 5 : Bank‑grade Security",
    heading: "Your data stays yours",
    body:
      "End‑to‑end encryption in transit and at rest. Granular sharing controls. Compliant with regional privacy standards.",
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
  },
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function FeatureShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [arrowDisabled, setArrowDisabled] = useState(false);
  const sectionRef = useRef(null);

  const num = FEATURES.length;

  useEffect(() => {
    // Preload images to avoid flashes/broken first image
    FEATURES.forEach((f) => {
      const img = new Image();
      img.src = f.imageUrl;
    });

    const el = sectionRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const totalScrollable = el.offsetHeight - viewportHeight;
      const progressRaw = clamp((0 - rect.top) / (totalScrollable || 1), 0, 1);
      const index = clamp(Math.floor(progressRaw * num), 0, num - 1);
      setActiveIndex(index);
    };

    let rafId = null;
    const loop = () => {
      onScroll();
      rafId = window.requestAnimationFrame(loop);
    };
    rafId = window.requestAnimationFrame(loop);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [num]);

  // Debounce arrow clicks and keyboard navigation
  const debounce = (fn, delay = 250) => {
    let timer;
    return (...args) => {
      if (timer) return;
      fn(...args);
      setArrowDisabled(true);
      timer = setTimeout(() => {
        setArrowDisabled(false);
        timer = null;
      }, delay);
    };
  };

  const prev = debounce(() => setActiveIndex((i) => clamp(i - 1, 0, num - 1)));
  const next = debounce(() => setActiveIndex((i) => clamp(i + 1, 0, num - 1)));

  useEffect(() => {
    const onKey = (e) => {
      if (arrowDisabled) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [arrowDisabled, next, prev]);

  // ...existing code...

  const active = useMemo(() => FEATURES[activeIndex], [activeIndex]);

  const handleImgError = (e) => {
    // Swap to a reliable fallback image if the primary fails
    e.currentTarget.onerror = null;
    e.currentTarget.src = "https://images.unsplash.com/photo-1520974735194-17af1f39f365?q=80&w=1200&auto=format&fit=crop";
  };

  return (
    <section ref={sectionRef} className="feature-section" aria-label="Feature Showcase">
      <div className="feature-sticky card">
        <div className="feature-left">
          <div className="feature-tag">Feature No.{active.id} -</div>
          <h2 key={`h-${active.id}`} className="feature-heading fade-enter fade-enter-active">{active.heading}</h2>
          <ul key={`b-${active.id}`} className="feature-bullets fade-enter fade-enter-active" aria-live="polite">
            {active.body
              .split(".")
              .filter(Boolean)
              .map((line, idx) => (
                <li key={idx}>{line.trim()}.</li>
              ))}
          </ul>
          <div className="feature-arrows">
            <button
              className="arrow"
              aria-label="Previous feature"
              onClick={prev}
              disabled={activeIndex === 0 || arrowDisabled}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") prev(); }}
            >
              ←
            </button>
            <div className="divider" />
            <button
              className="arrow"
              aria-label="Next feature"
              onClick={next}
              disabled={activeIndex === num - 1 || arrowDisabled}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") next(); }}
            >
              →
            </button>
          </div>
        </div>

        <div className="feature-center">
          <div className="phone-shell">
            <div className="notch" />
            <img
              key={`img-${active.id}`}
              src={active.imageUrl}
              alt={active.title}
              className="phone-screen fade-enter fade-enter-active"
              onError={handleImgError}
            />
            <div className="bezel" />
          </div>
          <div className="dots" aria-hidden>
            {FEATURES.map((f, i) => (
              <button
                key={f.id}
                className={`dot ${i === activeIndex ? "active" : ""}`}
                onClick={() => setActiveIndex(i)}
                aria-label={`Go to feature ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="feature-right">
          <div className="right-title">Feature Showcase</div>
          <ol className="right-list">
            {FEATURES.map((f, idx) => (
              <li key={f.id}>
                <button
                  className={`right-item ${idx === activeIndex ? "active" : ""}`}
                  onClick={() => setActiveIndex(idx)}
                  aria-current={idx === activeIndex}
                >
                  <span className="indicator" aria-hidden />
                  <span>{f.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}


