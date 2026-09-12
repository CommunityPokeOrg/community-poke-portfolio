import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { quips, type Tone } from "../data/quips";
import type { SoundApi } from "../hooks/useSound";
import "./QuipReel.css";

const AUTOPLAY_MS = 6000;

const toneLabel: Record<Tone, string> = { dry: "dry", chaos: "chaos", warm: "warm", ominous: "ominous" };

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function QuipReel({ sound }: { sound: SoundApi }) {
  const reduce = useReducedMotion();
  const [order, setOrder] = useState<number[]>(() => quips.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [toneFilter, setToneFilter] = useState<Tone | "all">("all");
  const [pulse, setPulse] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const regionRef = useRef<HTMLDivElement>(null);

  const sequence = useMemo(() => order.filter((i) => toneFilter === "all" || quips[i].tone === toneFilter), [order, toneFilter]);
  const safePos = sequence.length ? Math.min(pos, sequence.length - 1) : 0;
  const current = sequence.length ? quips[sequence[safePos]] : null;

  const go = useCallback(
    (delta: number) => {
      if (!sequence.length) return;
      setPos((p) => (p + delta + sequence.length) % sequence.length);
      setPulse((n) => n + 1);
      setProgressKey((k) => k + 1);
    },
    [sequence.length],
  );

  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (current) sound.play(current.tone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  useEffect(() => {
    if (!playing || sequence.length < 2) return;
    const t = window.setInterval(() => go(1), AUTOPLAY_MS);
    return () => window.clearInterval(t);
  }, [playing, go, sequence.length]);

  useEffect(() => {
    const onVis = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.target !== regionRef.current) return;
    if (e.key === "ArrowRight" || e.key === "l") go(1);
    else if (e.key === "ArrowLeft" || e.key === "h") go(-1);
    else if (e.key === " ") {
      e.preventDefault();
      setPlaying((p) => !p);
    } else if (e.key === "s") reshuffle();
    else return;
    e.preventDefault();
  };

  const reshuffle = () => {
    setOrder(shuffle(quips.map((_, i) => i)));
    setPos(0);
    setPulse((n) => n + 1);
    setProgressKey((k) => k + 1);
    sound.play("select");
  };

  const copy = async () => {
    if (!current) return;
    try {
      await navigator.clipboard.writeText(`“${current.text}” — ${current.speaker}, ${current.source.url}`);
      setCopied(true);
      sound.play("select");
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="section reel" id="reel" aria-labelledby="reel-title">
      <div className="wrap">
        <div className="section__head">
          <div>
            <p className="section__kicker">03 · moment reel</p>
            <h2 className="section__title" id="reel-title">
              Quip Reel
            </h2>
            <p className="section__lede">
              {quips.length} lines the community actually wrote down, quoted verbatim from public READMEs. Sound is synthesised on the fly, off by default, and never required.
            </p>
          </div>
          <div className="reel__sound">
            <button type="button" className="btn" aria-pressed={sound.enabled} disabled={!sound.supported} onClick={sound.toggle} title={sound.supported ? undefined : "Web Audio is not available in this browser"}>
              {sound.supported ? (sound.enabled ? "◉ sound on" : "○ sound off") : "○ audio unavailable"}
            </button>
          </div>
        </div>

        <div className="reel__tones chip-row" role="group" aria-label="Filter by tone">
          <button type="button" className="chip" aria-pressed={toneFilter === "all"} onClick={() => { setToneFilter("all"); setPos(0); }}>
            all tones
          </button>
          {(Object.keys(toneLabel) as Tone[]).map((t) => (
            <button key={t} type="button" className={`chip chip--tone-${t}`} aria-pressed={toneFilter === t} onClick={() => { setToneFilter(t); setPos(0); }}>
              {toneLabel[t]} <span className="reel__count">{quips.filter((q) => q.tone === t).length}</span>
            </button>
          ))}
        </div>

        <div
          ref={regionRef}
          className={`reel__stage panel ${current ? `reel__stage--${current.tone}` : ""}`}
          tabIndex={0}
          role="group"
          aria-roledescription="carousel"
          aria-label="Quip reel. Use left and right arrow keys to move, space to toggle autoplay, s to shuffle."
          onKeyDown={onKey}
        >
          <div className="reel__meter" aria-hidden="true">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} style={{ ["--i" as string]: i }} className={pulse % 2 ? "reel__bar reel__bar--a" : "reel__bar reel__bar--b"} />
            ))}
          </div>

          <div className="reel__body" aria-live="polite" aria-atomic="true">
            {current ? (
              <AnimatePresence mode="wait" initial={false}>
                <motion.blockquote key={current.id} initial={reduce ? false : { opacity: 0, y: 14, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={reduce ? undefined : { opacity: 0, y: -10, filter: "blur(4px)" }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="reel__quote">
                  <p className="reel__text">{current.text}</p>
                  <footer className="reel__attrib mono">
                    <span className="reel__speaker">— {current.speaker}</span>
                    <a className="reel__source link-ext" href={current.source.url} target="_blank" rel="noreferrer">
                      {current.source.label}
                    </a>
                    <span className={`tag reel__tone reel__tone--${current.tone}`}>{current.tone}</span>
                  </footer>
                </motion.blockquote>
              </AnimatePresence>
            ) : (
              <div className="empty">no quips match this tone filter.</div>
            )}
          </div>

          <div className="reel__controls">
            <div className="reel__transport">
              <button type="button" className="btn btn--icon" aria-label="Previous quip" onClick={() => go(-1)} disabled={sequence.length < 2}>
                ‹
              </button>
              <button type="button" className="btn btn--icon reel__play" aria-label={playing ? "Pause autoplay" : "Start autoplay"} aria-pressed={playing} onClick={() => setPlaying((p) => !p)} disabled={sequence.length < 2}>
                {playing ? "▮▮" : "▶"}
              </button>
              <button type="button" className="btn btn--icon" aria-label="Next quip" onClick={() => go(1)} disabled={sequence.length < 2}>
                ›
              </button>
              <button type="button" className="btn" onClick={reshuffle} aria-label="Shuffle order">
                ⤨ shuffle
              </button>
              <button type="button" className="btn" onClick={copy} disabled={!current} aria-live="polite">
                {copied ? "✓ copied" : "⧉ copy"}
              </button>
            </div>
            <div className="reel__position mono" aria-hidden="true">
              {sequence.length ? `${String(safePos + 1).padStart(2, "0")} / ${String(sequence.length).padStart(2, "0")}` : "-- / --"}
            </div>
          </div>

          <div className="reel__progress" aria-hidden="true">
            {playing && !reduce && <span key={progressKey} className="reel__progress-bar" style={{ animationDuration: `${AUTOPLAY_MS}ms` }} />}
            {playing && reduce && <span className="reel__progress-bar reel__progress-bar--static" />}
          </div>
        </div>

        <ol className="reel__dots" aria-label="Jump to quip">
          {sequence.map((qi, i) => (
            <li key={quips[qi].id}>
              <button type="button" className={`reel__dot reel__dot--${quips[qi].tone}`} aria-label={`Quip ${i + 1}: ${quips[qi].text.slice(0, 40)}…`} aria-current={i === safePos ? "true" : undefined} onClick={() => { setPos(i); setPulse((n) => n + 1); setProgressKey((k) => k + 1); }} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
