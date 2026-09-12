import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { allProjects, games, projects, repos } from "../data/projects";
import { lore } from "../data/lore";
import { site } from "../data/site";
import "./Hero.css";

const bootLines = [
  "$ poke --instance community --bridge tdlib,discord",
  "[ok] identity        community slop, lovingly curated",
  "[ok] governance      vibes with code review",
  "[ok] engineering     one dedicated devin (unsupervised)",
  `[ok] catalog         ${games.length} games · ${projects.length} projects · ${repos.length} repos`,
  `[ok] archive         ${lore.length} lore entries indexed`,
  "> ready. be useful — failing that, be funny.",
];

function useTypedLines(lines: string[], enabled: boolean) {
  const [count, setCount] = useState(enabled ? 0 : lines.length);
  useEffect(() => {
    if (!enabled) return;
    if (count >= lines.length) return;
    const t = window.setTimeout(() => setCount((c) => c + 1), count === 0 ? 300 : 240);
    return () => window.clearTimeout(t);
  }, [count, enabled, lines.length]);
  return lines.slice(0, count);
}

export function Hero() {
  const reduce = useReducedMotion();
  const typed = useTypedLines(bootLines, !reduce);
  const done = typed.length === bootLines.length;

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <motion.p className="hero__eyebrow mono" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="hero__live" aria-hidden="true" /> shared poke ultra instance · official poke community discord
          </motion.p>
          <motion.h1 id="hero-title" className="hero__title" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}>
            Community <span className="hero__title-accent">Poke</span>
          </motion.h1>
          <motion.p className="hero__tagline" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
            {site.tagline}
          </motion.p>
          <motion.p className="hero__desc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}>
            {site.description}
          </motion.p>
          <motion.div className="hero__cta" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <a className="btn btn--primary" href="#projects">
              Browse the catalog
            </a>
            <a className="btn" href="#lore">
              Open the Lore Archive
            </a>
          </motion.div>
          <motion.dl className="hero__facts mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.55 }}>
            <div>
              <dt>Entries</dt>
              <dd>{allProjects.length}</dd>
            </div>
            <div>
              <dt>Orgs</dt>
              <dd>{site.orgs.length}</dd>
            </div>
            <div>
              <dt>Bridges</dt>
              <dd>2</dd>
            </div>
            <div>
              <dt>Supervision</dt>
              <dd>occasional</dd>
            </div>
          </motion.dl>
        </div>

        <motion.div className="hero__term panel" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} aria-label="Boot sequence" role="img">
          <div className="hero__term-bar" aria-hidden="true">
            <span />
            <span />
            <span />
            <em className="mono">community-poke — boot</em>
          </div>
          <pre className="hero__term-body mono" aria-hidden="true">
            {typed.map((line, i) => (
              <span key={i} className={line.startsWith(">") ? "hero__term-ready" : line.startsWith("$") ? "hero__term-cmd" : undefined}>
                {line}
                {"\n"}
              </span>
            ))}
            <span className={`hero__caret ${done ? "hero__caret--idle" : ""}`}>█</span>
          </pre>
          <p className="sr-only">{bootLines.join(". ")}</p>
        </motion.div>
      </div>
    </section>
  );
}
