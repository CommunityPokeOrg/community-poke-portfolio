import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { badges, members, milestones, repoSnapshot, snapshotTakenAt } from "../data/hallOfFame";
import type { SoundApi } from "../hooks/useSound";
import { hydrateRepos, summarize, type HydrationState } from "../lib/github";
import "./Stats.css";

const fmtDate = (d: Date | string | null) =>
  d ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(typeof d === "string" ? new Date(d) : d) : "—";

const fmtTime = (d: Date | string | null) =>
  d ? new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }).format(typeof d === "string" ? new Date(d) : d) + " UTC" : "—";

function Counter({ value, reduce }: { value: number; reduce: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      el.textContent = String(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 700;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      el.textContent = String(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, reduce]);
  return <span ref={ref}>{value}</span>;
}

export function Stats({ sound }: { sound: SoundApi }) {
  const reduce = useReducedMotion() ?? false;
  const [state, setState] = useState<HydrationState>({ status: "loading", repos: repoSnapshot });
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const ctl = new AbortController();
    hydrateRepos(ctl.signal).then((s) => {
      if (!ctl.signal.aborted) setState(s);
    });
    return () => ctl.abort();
  }, [retry]);

  const doRetry = () => {
    setState({ status: "loading", repos: repoSnapshot });
    setRetry((n) => n + 1);
    sound.play("tick");
  };

  const sum = summarize(state.repos);
  const loading = state.status === "loading";

  const stat = (label: string, value: number | string, hint?: string) => (
    <div className="stats__stat panel" key={label}>
      <span className="stats__stat-label">{label}</span>
      <span className={`stats__stat-value ${loading ? "stats__stat-value--loading" : ""} ${typeof value === "string" ? "stats__stat-value--text" : ""}`}>{typeof value === "number" ? <Counter value={value} reduce={reduce || loading} /> : value}</span>
      {hint && <span className="stats__stat-hint">{hint}</span>}
    </div>
  );

  return (
    <section className="section stats" id="stats" aria-labelledby="stats-title">
      <div className="wrap">
        <div className="section__head">
          <div>
            <p className="section__kicker">04 · telemetry</p>
            <h2 className="section__title" id="stats-title">
              Stats &amp; Hall of Fame
            </h2>
            <p className="section__lede">Numbers come from the public GitHub API when it answers; otherwise from a bundled snapshot. Anything the API cannot vouch for is marked curated.</p>
          </div>
          <div className={`stats__source stats__source--${state.status}`} role="status">
            <span className="stats__source-dot" aria-hidden="true" />
            {state.status === "loading" && <span>querying api.github.com…</span>}
            {state.status === "live" && <span>live · fetched {fmtTime(state.fetchedAt)}</span>}
            {state.status === "snapshot" && (
              <span>
                snapshot {fmtDate(snapshotTakenAt)} · {state.reason}{" "}
                <button type="button" className="stats__retry" onClick={doRetry}>
                  retry
                </button>
              </span>
            )}
          </div>
        </div>

        <div className="stats__grid" aria-busy={loading}>
          {stat("repositories", sum.repoCount, `${sum.orgs} orgs`)}
          {stat("stars", sum.stars, "and counting, slowly")}
          {stat("forks", sum.forks)}
          {stat("open issues", sum.openIssues)}
          {stat("first repo", fmtDate(sum.firstRepo), sum.firstRepo ? fmtTime(sum.firstRepo) : undefined)}
          {stat("last push", fmtDate(sum.lastPush), sum.lastPush ? fmtTime(sum.lastPush) : undefined)}
        </div>

        <div className="stats__langs" aria-label="Languages by repository count">
          {sum.languages.map(([lang, n]) => (
            <span key={lang} className="stats__lang">
              <span className={`stats__lang-swatch stats__lang-swatch--${lang.toLowerCase()}`} aria-hidden="true" />
              {lang} <span className="stats__lang-n">×{n}</span>
            </span>
          ))}
          {sum.languages.length === 0 && <span className="empty">no language data.</span>}
        </div>

        <div className="stats__layout">
          <div className="stats__fame">
            <h3 className="stats__sub">
              Hall of Fame <span className="tag tag--verified">verified</span>
            </h3>
            <p className="stats__note">Commit authors across the community's repositories, counted from the public API. There are no humans on this list because the community ships through its agents and its shared instance.</p>
            <ul className="stats__members">
              {members.map((m, i) => (
                <motion.li
                  key={m.login}
                  className={`stats__member panel stats__member--${m.kind}`}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                >
                  <div className="stats__member-head">
                    <span className="stats__avatar" aria-hidden="true">
                      {m.kind === "instance" ? "◈" : "⟁"}
                    </span>
                    <div>
                      <a className="stats__login link-ext" href={m.url} target="_blank" rel="noreferrer" onFocus={() => sound.play("tick")}>
                        {m.login}
                      </a>
                      <p className="stats__role">{m.role}</p>
                    </div>
                    <span className="stats__commits mono" title="Commits authored across community repos (snapshot)">
                      {m.contributions}
                      <small>commits</small>
                    </span>
                  </div>
                  <ul className="stats__badges" aria-label="Badges">
                    {m.badges.map((b) => (
                      <li key={b} className="stats__badge" title={badges[b].description}>
                        <span aria-hidden="true">{badges[b].glyph}</span> {badges[b].label}
                        <span className="sr-only">: {badges[b].description}</span>
                      </li>
                    ))}
                  </ul>
                  <ul className="stats__highlights">
                    {m.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="stats__milestones">
            <h3 className="stats__sub">Milestones</h3>
            <ol className="stats__timeline">
              {milestones.map((ms) => (
                <li key={ms.id} className={`stats__ms stats__ms--${ms.provenance}`}>
                  <span className="stats__ms-when mono">{ms.when}</span>
                  <div>
                    <p className="stats__ms-label">
                      {ms.url ? (
                        <a href={ms.url} target="_blank" rel="noreferrer" className="link-ext">
                          {ms.label}
                        </a>
                      ) : (
                        ms.label
                      )}{" "}
                      <span className={`tag tag--${ms.provenance}`}>{ms.provenance}</span>
                    </p>
                    <p className="stats__ms-detail">{ms.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <details className="stats__repos">
          <summary>
            per-repository breakdown <span className="stats__repos-n">({state.repos.length})</span>
          </summary>
          <div className="stats__table-wrap">
            <table className="stats__table">
              <thead>
                <tr>
                  <th scope="col">repository</th>
                  <th scope="col">lang</th>
                  <th scope="col" className="num">★</th>
                  <th scope="col" className="num">forks</th>
                  <th scope="col" className="num">issues</th>
                  <th scope="col">last push</th>
                </tr>
              </thead>
              <tbody>
                {state.repos.map((r) => (
                  <tr key={r.fullName}>
                    <td>
                      <a href={`https://github.com/${r.fullName}`} target="_blank" rel="noreferrer">
                        {r.fullName}
                      </a>
                    </td>
                    <td>{r.language ?? "—"}</td>
                    <td className="num">{r.stars}</td>
                    <td className="num">{r.forks}</td>
                    <td className="num">{r.openIssues}</td>
                    <td>{fmtDate(r.pushedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </section>
  );
}
