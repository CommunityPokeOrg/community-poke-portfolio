import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useMemo, useState } from "react";
import { allProjects, categoryLabel, type Category } from "../data/projects";
import type { SoundApi } from "../hooks/useSound";
import "./Projects.css";

type Filter = "all" | Category;

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "game", label: categoryLabel.game },
  { id: "project", label: categoryLabel.project },
  { id: "repo", label: categoryLabel.repo },
];

const glyph: Record<Category, string> = { game: "▶", project: "◆", repo: "⌥" };

export function Projects({ sound }: { sound: SoundApi }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const reduce = useReducedMotion();
  const inputId = useId();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allProjects.filter((p) => (filter === "all" || p.category === filter) && (!q || `${p.name} ${p.description} ${p.tags.join(" ")}`.toLowerCase().includes(q)));
  }, [filter, query]);

  return (
    <section className="section projects" id="projects" aria-labelledby="projects-title">
      <div className="wrap">
        <div className="section__head">
          <div>
            <p className="section__kicker">01 · catalog</p>
            <h2 className="section__title" id="projects-title">
              Everything the server shipped
            </h2>
            <p className="section__lede">Games, tools and repositories produced by the Poke Community. Every link below was reachable when this build was made.</p>
          </div>
          <div className="projects__controls">
            <div className="chip-row" role="group" aria-label="Filter by category">
              {filters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className="chip"
                  aria-pressed={filter === f.id}
                  onClick={() => {
                    setFilter(f.id);
                    sound.play("tick");
                  }}
                >
                  {f.label}
                  <span className="projects__count"> {f.id === "all" ? allProjects.length : allProjects.filter((p) => p.category === f.id).length}</span>
                </button>
              ))}
            </div>
            <label className="projects__search">
              <span className="sr-only" id={inputId}>
                Search the catalog
              </span>
              <span className="projects__prompt mono" aria-hidden="true">
                /
              </span>
              <input type="search" aria-labelledby={inputId} placeholder="search…" value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off" spellCheck={false} />
            </label>
          </div>
        </div>

        <p className="sr-only" role="status">
          {visible.length} of {allProjects.length} entries shown
        </p>

        {visible.length === 0 ? (
          <div className="empty">
            no entries match “{query}” in {filter === "all" ? "any category" : categoryLabel[filter]}.{" "}
            <button
              type="button"
              className="projects__reset"
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
            >
              reset filters
            </button>
          </div>
        ) : (
          <motion.ul className="projects__grid" layout={!reduce}>
            <AnimatePresence initial={false}>
              {visible.map((p) => (
                <motion.li
                  key={p.id}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className={`card card--${p.category}`}
                >
                  <a href={p.url} target="_blank" rel="noreferrer" className="card__link" onMouseEnter={() => sound.play("tick")} onFocus={() => sound.play("tick")}>
                    <div className="card__top mono">
                      <span className="card__glyph" aria-hidden="true">
                        {glyph[p.category]}
                      </span>
                      <span className="card__cat">{categoryLabel[p.category].replace(/s$/, "")}</span>
                      <span className="card__arrow" aria-hidden="true">
                        ↗
                      </span>
                    </div>
                    <h3 className="card__name">{p.name}</h3>
                    <p className="card__desc">{p.description}</p>
                    <ul className="card__tags" aria-label="tags">
                      {p.tags.map((t) => (
                        <li key={t} className="tag">
                          {t}
                        </li>
                      ))}
                    </ul>
                    <span className="card__url mono">{p.url.replace(/^https:\/\//, "")}</span>
                  </a>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>
    </section>
  );
}
