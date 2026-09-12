import { repoSnapshot, type RepoSnapshot } from "../data/hallOfFame";

export type HydrationState =
  | { status: "loading"; repos: RepoSnapshot[] }
  | { status: "live"; repos: RepoSnapshot[]; fetchedAt: string }
  | { status: "snapshot"; repos: RepoSnapshot[]; reason: string };

interface GhRepo {
  full_name: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  created_at: string;
  pushed_at: string;
  fork: boolean;
}

function isGhRepo(v: unknown): v is GhRepo {
  return typeof v === "object" && v !== null && "full_name" in v && "stargazers_count" in v;
}

const toSnapshot = (r: GhRepo): RepoSnapshot => ({
  fullName: r.full_name,
  stars: r.stargazers_count,
  forks: r.forks_count,
  openIssues: r.open_issues_count,
  language: r.language,
  createdAt: r.created_at,
  pushedAt: r.pushed_at,
  isFork: r.fork,
});

/**
 * Hydrate the repo snapshot from the public GitHub API. Any failure (offline,
 * rate limit, unexpected payload) resolves to the bundled snapshot with a reason.
 */
export async function hydrateRepos(signal?: AbortSignal): Promise<HydrationState> {
  try {
    // check the quota with a single cheap call before fanning out, so a rate-limited
    // client fails fast with one request instead of one per repository
    const limit = await fetch("https://api.github.com/rate_limit", { signal, headers: { Accept: "application/vnd.github+json" } });
    if (!limit.ok) throw new Error(`GitHub API responded ${limit.status}`);
    const quota: unknown = await limit.json();
    const remaining =
      typeof quota === "object" && quota !== null && "rate" in quota && typeof quota.rate === "object" && quota.rate !== null && "remaining" in quota.rate ? Number(quota.rate.remaining) : 0;
    if (remaining < repoSnapshot.length) throw new Error("GitHub API rate limit reached");

    const results = await Promise.all(
      repoSnapshot.map(async (r) => {
        const res = await fetch(`https://api.github.com/repos/${r.fullName}`, {
          signal,
          headers: { Accept: "application/vnd.github+json" },
        });
        if (res.status === 403 || res.status === 429) throw new Error("GitHub API rate limit reached");
        if (!res.ok) throw new Error(`GitHub API responded ${res.status} for ${r.fullName}`);
        const json: unknown = await res.json();
        if (!isGhRepo(json)) throw new Error("Unexpected GitHub API payload");
        return toSnapshot(json);
      }),
    );
    return { status: "live", repos: results, fetchedAt: new Date().toISOString() };
  } catch (err) {
    const reason = err instanceof Error ? err.message : "Unknown error";
    return { status: "snapshot", repos: repoSnapshot, reason };
  }
}

export function summarize(repos: RepoSnapshot[]) {
  const languages = new Map<string, number>();
  for (const r of repos) if (r.language) languages.set(r.language, (languages.get(r.language) ?? 0) + 1);
  const pushed = repos.map((r) => Date.parse(r.pushedAt)).filter(Number.isFinite);
  const created = repos.map((r) => Date.parse(r.createdAt)).filter(Number.isFinite);
  return {
    repoCount: repos.length,
    stars: repos.reduce((n, r) => n + r.stars, 0),
    forks: repos.reduce((n, r) => n + r.forks, 0),
    openIssues: repos.reduce((n, r) => n + r.openIssues, 0),
    languages: Array.from(languages.entries()).sort((a, b) => b[1] - a[1]),
    lastPush: pushed.length ? new Date(Math.max(...pushed)) : null,
    firstRepo: created.length ? new Date(Math.min(...created)) : null,
    orgs: new Set(repos.map((r) => r.fullName.split("/")[0])).size,
  };
}
