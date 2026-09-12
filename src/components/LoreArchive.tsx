import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { allTags, eraOrder, eras, lore, type Era, type LoreEntry, type Provenance } from "../data/lore";
import type { SoundApi } from "../hooks/useSound";
import "./LoreArchive.css";

type EraFilter = "all" | Era;
type ProvFilter = "all" | Provenance;

function formatWhen(when: string) {
  const d = new Date(when);
  if (Number.isNaN(d.getTime())) return when;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function readHashEntry(): string | null {
  const m = /^#lore\/([\w-]+)$/.exec(window.location.hash);
  return m ? m[1] : null;
}

export function LoreArchive({ sound }: { sound: SoundApi }) {
  const [era, setEra] = useState<EraFilter>("all");
  const [prov, setProv] = useState<ProvFilter>("all");
  const [tag, setTag] = useState<string | null>(null);
  const [chosenId, setSelectedId] = useState<string>(() => readHashEntry() ?? lore[0].id);
  const listRef = useRef<HTMLOListElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const visible = useMemo(
    () => lore.filter((l) => (era === "all" || l.era === era) && (prov === "all" || l.provenance === prov) && (!tag || l.tags.includes(tag))),
    [era, prov, tag],
  );

  // if the filter hides the chosen record, fall back to the first visible one
  const selectedId = visible.some((l) => l.id === chosenId) ? chosenId : (visible[0]?.id ?? null);
  const selected = useMemo(() => lore.find((l) => l.id === selectedId) ?? null, [selectedId]);
  const selectedIndex = visible.findIndex((l) => l.id === selectedId);

  useEffect(() => {
    const onHash = () => {
      const id = readHashEntry();
      if (id && lore.some((l) => l.id === id)) setSelectedId(id);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const select = useCallback(
    (entry: LoreEntry, focus = false) => {
      setSelectedId(entry.id);
      sound.play("select");
      window.history.replaceState(null, "", `#lore/${entry.id}`);
      if (focus) listRef.current?.querySelector<HTMLButtonElement>(`[data-id="${entry.id}"]`)?.focus();
      // stacked layout: the record sits below the rail, so bring it into view on click
      else if (!window.matchMedia("(min-width: 60rem)").matches) detailRef.current?.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
    },
    [sound, reduce],
  );

  const onListKey = (e: React.KeyboardEvent) => {
    if (!visible.length) return;
    const idx = Math.max(0, selectedIndex);
    let next: number | null = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === "j") next = Math.min(visible.length - 1, idx + 1);
    if (e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "k") next = Math.max(0, idx - 1);
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = visible.length - 1;
    if (next !== null) {
      e.preventDefault();
      select(visible[next], true);
    }
  };

  const verifiedCount = lore.filter((l) => l.provenance === "verified").length;

  return (
    <section className="section lore" id="lore" aria-labelledby="lore-title">
      <div className="wrap">
        <div className="section__head">
          <div>
            <p className="section__kicker">02 · archive</p>
            <h2 className="section__title" id="lore-title">
              Community Lore Archive
            </h2>
            <p className="section__lede">
              {lore.length} records. <span className="tag tag--verified">verified</span> entries link to repository history; <span className="tag tag--curated">curated</span> entries are server canon retold from the Discord — names as the
              community tells them, not something we can point a commit at.
            </p>
          </div>
          <div className="lore__legend mono" aria-hidden="true">
            <span>
              <kbd>↑</kbd>
              <kbd>↓</kbd> navigate
            </span>
            <span>
              <kbd>home</kbd>
              <kbd>end</kbd> jump
            </span>
          </div>
        </div>

        <div className="lore__filters">
          <div className="chip-row" role="tablist" aria-label="Era">
            <button type="button" role="tab" className="chip" aria-selected={era === "all"} onClick={() => setEra("all")}>
              all eras
            </button>
            {eraOrder.map((e) => (
              <button key={e} type="button" role="tab" className="chip" aria-selected={era === e} onClick={() => setEra(e)} title={eras[e].blurb}>
                {eras[e].label}
              </button>
            ))}
          </div>
          <div className="chip-row" role="group" aria-label="Provenance">
            {(["all", "verified", "curated"] as const).map((p) => (
              <button key={p} type="button" className={`chip ${p !== "all" ? `chip--${p}` : ""}`} aria-pressed={prov === p} onClick={() => setProv(p)}>
                {p === "all" ? "any provenance" : p}
                <span className="lore__count"> {p === "all" ? lore.length : p === "verified" ? verifiedCount : lore.length - verifiedCount}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lore__layout">
          <div className="lore__rail">
            <p className="sr-only" role="status">
              {visible.length} of {lore.length} records shown
            </p>
            {visible.length === 0 ? (
              <div className="empty">
                nothing in the archive matches that combination.{" "}
                <button
                  type="button"
                  className="lore__reset"
                  onClick={() => {
                    setEra("all");
                    setProv("all");
                    setTag(null);
                  }}
                >
                  clear filters
                </button>
              </div>
            ) : (
              <ol ref={listRef} className="lore__list" aria-label="Lore records" onKeyDown={onListKey}>
                <AnimatePresence initial={false}>
                  {visible.map((entry, i) => {
                    const isSel = entry.id === selectedId;
                    const showEra = i === 0 || visible[i - 1].era !== entry.era;
                    return (
                      <motion.li key={entry.id} layout={!reduce} initial={reduce ? false : { opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? undefined : { opacity: 0, x: -8 }} transition={{ duration: 0.2 }} className={`lore__item lore__item--${entry.era}`}>
                        {showEra && (
                          <div className="lore__era mono" aria-hidden="true">
                            {eras[entry.era].label}
                          </div>
                        )}
                        <button type="button" data-id={entry.id} className="lore__node" aria-current={isSel ? "true" : undefined} tabIndex={isSel || (selectedIndex === -1 && i === 0) ? 0 : -1} onClick={() => select(entry)}>
                          <span className="lore__dot" aria-hidden="true" />
                          <span className="lore__when mono">{formatWhen(entry.when)}</span>
                          <span className="lore__node-title">{entry.title}</span>
                          <span className={`tag tag--${entry.provenance}`}>{entry.provenance}</span>
                        </button>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ol>
            )}
          </div>

          <div className="lore__detail panel" aria-live="polite" ref={detailRef}>
            <AnimatePresence mode="wait" initial={false}>
              {selected ? (
                <motion.article key={selected.id} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0, y: -6 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }} className={`lore__record lore__record--${selected.provenance}`}>
                  <header className="lore__record-head">
                    <div className="lore__record-meta mono">
                      <span className={`tag tag--${selected.provenance}`}>{selected.provenance}</span>
                      <span>{eras[selected.era].label}</span>
                      <span>·</span>
                      <time dateTime={Number.isNaN(Date.parse(selected.when)) ? undefined : selected.when}>{formatWhen(selected.when)}</time>
                      <span className="lore__record-idx">
                        #{String(lore.indexOf(selected) + 1).padStart(2, "0")}/{String(lore.length).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="lore__record-title">{selected.title}</h3>
                    <p className="lore__record-summary">{selected.summary}</p>
                  </header>

                  {selected.artifact && (
                    <div className="lore__artifact mono" aria-label="artifact">
                      <span className="lore__artifact-label">artifact</span>
                      <code>{selected.artifact}</code>
                    </div>
                  )}

                  <div className="lore__record-body">
                    {selected.body.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>

                  {selected.provenance === "curated" && (
                    <p className="lore__disclaimer mono">
                      ⚠ curated: retold from server conversation. Not sourced from repository history. Corrections welcome via pull request.
                    </p>
                  )}

                  <footer className="lore__record-foot">
                    <ul className="chip-row" aria-label="Filter by tag">
                      {selected.tags.map((t) => (
                        <li key={t}>
                          <button type="button" className="chip" aria-pressed={tag === t} onClick={() => setTag(tag === t ? null : t)}>
                            #{t}
                          </button>
                        </li>
                      ))}
                    </ul>
                    {selected.source ? (
                      <a className="btn link-ext" href={selected.source.url} target="_blank" rel="noreferrer" onClick={() => sound.play("open")}>
                        {selected.source.label}
                      </a>
                    ) : (
                      <span className="lore__nosource mono">no linkable source</span>
                    )}
                  </footer>

                  <div className="lore__pager">
                    <button type="button" className="btn btn--ghost" disabled={selectedIndex <= 0} onClick={() => select(visible[selectedIndex - 1], true)}>
                      ← previous
                    </button>
                    <button type="button" className="btn btn--ghost" disabled={selectedIndex === -1 || selectedIndex >= visible.length - 1} onClick={() => select(visible[selectedIndex + 1], true)}>
                      next →
                    </button>
                  </div>
                </motion.article>
              ) : (
                <div key="empty" className="empty">
                  select a record from the rail.
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {tag && (
          <p className="lore__tagnote mono" role="status">
            filtering by <strong>#{tag}</strong> — {allTags.length} tags in the archive.{" "}
            <button type="button" className="lore__reset" onClick={() => setTag(null)}>
              clear
            </button>
          </p>
        )}
      </div>
    </section>
  );
}
