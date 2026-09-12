import { useEffect, useState } from "react";
import { nav, site, type NavId } from "../data/site";
import type { SoundApi } from "../hooks/useSound";
import "./Nav.css";

interface Props {
  sound: SoundApi;
}

export function Nav({ sound }: Props) {
  const [active, setActive] = useState<NavId | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = nav.map((n) => document.getElementById(n.id)).filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id as NavId);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.2, 0.5] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      const hit = nav.find((n) => n.key === e.key);
      if (hit) {
        document.getElementById(hit.id)?.scrollIntoView({ block: "start" });
        sound.play("tick");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sound]);

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="wrap nav__inner">
        <a className="nav__brand" href="#top" aria-label="Community Poke — back to top">
          <span className="nav__sigil" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="nav__name mono">
            community<span className="nav__name-dot">.</span>poke
          </span>
        </a>

        <nav aria-label="Sections" className="nav__links">
          {nav.map((n) => (
            <a key={n.id} href={`#${n.id}`} className="nav__link" aria-current={active === n.id ? "location" : undefined} onClick={() => sound.play("tick")}>
              <kbd aria-hidden="true">{n.key}</kbd>
              <span>{n.label}</span>
            </a>
          ))}
        </nav>

        <div className="nav__tools">
          <button
            type="button"
            className="btn btn--icon btn--ghost"
            aria-pressed={sound.enabled}
            aria-label={sound.enabled ? "Disable interface sounds" : "Enable interface sounds"}
            title={sound.supported ? (sound.enabled ? "Sound on" : "Sound off") : "Audio unavailable in this browser"}
            disabled={!sound.supported}
            onClick={sound.toggle}
          >
            <SoundIcon on={sound.enabled} />
          </button>
          <a className="btn btn--ghost nav__gh" href={site.repoUrl} target="_blank" rel="noreferrer" onClick={() => sound.play("tick")}>
            <GitHubIcon /> <span>Source</span>
          </a>
        </div>
      </div>
    </header>
  );
}

function SoundIcon({ on }: { on: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 10v4h3l4 3V7L7 10H4z" fill={on ? "currentColor" : "none"} />
      {on ? (
        <>
          <path d="M15 9.5a3.5 3.5 0 0 1 0 5" />
          <path d="M17.5 7a7 7 0 0 1 0 10" />
        </>
      ) : (
        <path d="M16 9l5 5M21 9l-5 5" />
      )}
    </svg>
  );
}

export function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}
