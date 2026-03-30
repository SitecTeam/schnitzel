import { useState, useEffect, useRef } from "react";

import keyframe1 from "@/assets/hero/keyframe-1.webp";
import keyframe2 from "@/assets/hero/keyframe-2.webp";
import keyframe3 from "@/assets/hero/keyframe-3.webp";
import keyframe4 from "@/assets/hero/keyframe-4.webp";
import keyframe5 from "@/assets/hero/keyframe-5.webp";
import keyframe6 from "@/assets/hero/keyframe-6.webp";
import keyframe7 from "@/assets/hero/keyframe-7.webp";
import keyframe8 from "@/assets/hero/keyframe-8.webp";
import loopBackground from "@/assets/hero/loop-background.webp";
import loopSun from "@/assets/hero/loop-sunce.webp";
import loopKarabiner from "@/assets/hero/loop-karabiner.webp";
import loopPaper from "@/assets/hero/loop_papir.webp";

const FRAMES = [
  keyframe1.src,
  keyframe2.src,
  keyframe3.src,
  keyframe4.src,
  keyframe5.src,
  keyframe6.src,
  keyframe7.src,
  keyframe8.src,
];

// ~3 fps — classic stop-motion feel
const FRAME_DURATION = 300;

const WRAPPER_CLASS =
  "relative w-[105vw] max-w-none origin-bottom translate-x-2 scale-110 sm:mt-20 sm:w-[80vw] sm:scale-120 md:mt-0 md:scale-105 lg:w-full lg:max-w-189 lg:translate-x-0 lg:scale-100";

// Shared absolute fill — used by the base + all keyframe layers
const FILL_CLASS =
  "absolute inset-0 w-full h-full object-contain will-change-[opacity]";

export function HeroImage({
  alt = "Schnitzel podcast hero collage",
}: {
  alt?: string;
}) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [entranceDone, setEntranceDone] = useState(false);

  // Refs for the 8 entrance frames (used for img.decode() per-frame)
  const frameRefs = useRef<(HTMLImageElement | null)[]>([]);
  // Refs for the 4 loop images — decoded together before the final switch
  const loopRefs = useRef<(HTMLImageElement | null)[]>([]);

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (prefersReduced) {
      setEntranceDone(true);
      return;
    }

    let cancelled = false;

    const advance = async (nextFrame: number) => {
      if (cancelled) return;

      if (nextFrame >= FRAMES.length) {
        // Before the final switch, ensure ALL loop images are GPU-ready.
        // This makes the opacity flip from keyframe-8 → loop-background+overlays
        // happen in one paint with nothing missing.
        const loopImgs = loopRefs.current.filter(Boolean) as HTMLImageElement[];
        await Promise.all(loopImgs.map(img => img.decode().catch(() => {})));
        if (!cancelled) setEntranceDone(true);
        return;
      }

      const nextImg = frameRefs.current[nextFrame];

      // Hold current frame for FRAME_DURATION *and* decode the next frame in
      // parallel. Whichever takes longer wins — the current frame is visible
      // the whole time, so there is never a blank compositing gap.
      await Promise.all([
        new Promise<void>(resolve =>
          window.setTimeout(resolve, FRAME_DURATION)
        ),
        nextImg ? nextImg.decode().catch(() => {}) : Promise.resolve(),
      ]);

      if (cancelled) return;
      setCurrentFrame(nextFrame);
      advance(nextFrame + 1);
    };

    advance(1);
    return () => {
      cancelled = true;
    };
  }, []);

  // ─── Single DOM tree — nothing is ever mounted/unmounted ────────────────────
  // React 18 batches the setEntranceDone(true) state update into one paint, so
  // the opacity flip from keyframe-8 to loop-background+overlays is atomic.
  return (
    <div className={WRAPPER_CLASS} style={{ aspectRatio: "1 / 1" }}>
      {/* ── Sun behind background ── */}
      <img
        ref={el => {
          loopRefs.current[1] = el;
        }}
        src={loopSun.src}
        alt=""
        aria-hidden={true}
        loading="eager"
        decoding="async"
        className={`hero-overlay hero-overlay--sun ${entranceDone ? "hero-overlay--spin" : "opacity-0"}`}
      />

      {/* ── Loop base layer (hidden during entrance) ── */}
      <img
        ref={el => {
          loopRefs.current[0] = el;
        }}
        src={loopBackground.src}
        alt={alt}
        width={756}
        height={756}
        className={`${FILL_CLASS} drop-shadow-xl ${entranceDone ? "opacity-100" : "opacity-0"}`}
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />

      {/* ── Entrance keyframes ── */}
      {FRAMES.map((src, i) => (
        <img
          key={src}
          ref={el => {
            frameRefs.current[i] = el;
          }}
          src={src}
          alt=""
          aria-hidden={true}
          width={756}
          height={756}
          className={`${FILL_CLASS} drop-shadow-xl ${!entranceDone && i === currentFrame ? "opacity-100" : "opacity-0"}`}
          loading="eager"
          fetchPriority={i === 0 ? "high" : "auto"}
          decoding="async"
        />
      ))}

      {/* ── Loop overlays (hidden during entrance, animated after) ── */}
      {/* Paper first in DOM — karabiner after so it paints on top */}
      <img
        ref={el => {
          loopRefs.current[3] = el;
        }}
        src={loopPaper.src}
        alt=""
        aria-hidden={true}
        loading="eager"
        decoding="async"
        className={`hero-overlay hero-overlay--paper ${entranceDone ? "hero-overlay--rock" : "opacity-0"}`}
      />
      <img
        ref={el => {
          loopRefs.current[2] = el;
        }}
        src={loopKarabiner.src}
        alt=""
        aria-hidden={true}
        loading="eager"
        decoding="async"
        className={`hero-overlay hero-overlay--karabiner ${entranceDone ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
