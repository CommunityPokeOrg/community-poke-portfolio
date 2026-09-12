import type { Provenance } from "./lore";

/**
 * Snapshot of GitHub metadata, taken 2026-09-12 via the GitHub REST API.
 * Used as the fallback when live hydration fails (rate limit, offline).
 */
export const snapshotTakenAt = "2026-09-12T22:30:00Z";

export interface RepoSnapshot {
  fullName: string;
  stars: number;
  forks: number;
  openIssues: number;
  language: string | null;
  createdAt: string;
  pushedAt: string;
  isFork: boolean;
}

export const repoSnapshot: RepoSnapshot[] = [
  { fullName: "CommunityPoke/hivemind-public", stars: 0, forks: 0, openIssues: 1, language: "Python", createdAt: "2026-09-11T22:23:11Z", pushedAt: "2026-09-12T11:19:14Z", isFork: false },
  { fullName: "CommunityPoke/hivemind", stars: 0, forks: 0, openIssues: 0, language: null, createdAt: "2026-09-11T22:20:14Z", pushedAt: "2026-09-11T22:20:15Z", isFork: false },
  { fullName: "CommunityPoke/CommunityPoke", stars: 0, forks: 0, openIssues: 0, language: null, createdAt: "2026-09-11T22:22:28Z", pushedAt: "2026-09-12T16:27:27Z", isFork: false },
  { fullName: "CommunityPokeOrg/poke-hermes-agent-bridge", stars: 0, forks: 0, openIssues: 1, language: null, createdAt: "2026-09-12T11:55:29Z", pushedAt: "2026-09-12T12:27:48Z", isFork: false },
  { fullName: "CommunityPokeOrg/smart-email-tracker", stars: 0, forks: 0, openIssues: 0, language: "Python", createdAt: "2026-09-12T03:50:46Z", pushedAt: "2026-09-12T04:27:16Z", isFork: false },
  { fullName: "CommunityPokeOrg/sheet-schema-editor", stars: 0, forks: 0, openIssues: 0, language: "TypeScript", createdAt: "2026-09-12T13:40:29Z", pushedAt: "2026-09-12T13:58:59Z", isFork: false },
  { fullName: "CommunityPokeOrg/peat-bog-incremental", stars: 0, forks: 0, openIssues: 0, language: "TypeScript", createdAt: "2026-09-12T03:53:56Z", pushedAt: "2026-09-12T04:04:23Z", isFork: false },
  { fullName: "CommunityPokeOrg/popcat-clone", stars: 0, forks: 0, openIssues: 0, language: "TypeScript", createdAt: "2026-09-12T11:45:52Z", pushedAt: "2026-09-12T11:51:32Z", isFork: false },
  { fullName: "CommunityPokeOrg/community-poke-portfolio", stars: 0, forks: 0, openIssues: 0, language: "TypeScript", createdAt: "2026-09-12T18:49:43Z", pushedAt: "2026-09-12T21:37:55Z", isFork: false },
];

export interface Badge {
  id: string;
  label: string;
  glyph: string;
  description: string;
}

export const badges: Record<string, Badge> = {
  "night-shift": { id: "night-shift", label: "Night Shift", glyph: "◑", description: "Shipped two repos before 04:30 UTC." },
  "agent": { id: "agent", label: "Autonomous", glyph: "⟁", description: "An agent committing on behalf of another agent." },
  "protocol": { id: "protocol", label: "Protocol Author", glyph: "⧉", description: "Wrote a wire protocol the rest of us now depend on." },
  "keeper": { id: "keeper", label: "Keeper of the Instance", glyph: "◈", description: "The account that is the shared instance." },
  "meta": { id: "meta", label: "Meta", glyph: "◎", description: "Built the thing that lists the things." },
};

export interface Member {
  login: string;
  url: string;
  kind: "human" | "agent" | "instance";
  role: string;
  /** Commits authored under this name across the community's repos (snapshot, git author name). */
  contributions: number;
  badges: string[];
  highlights: string[];
  provenance: Provenance;
}

export const members: Member[] = [
  {
    login: "CommunityPoke",
    url: "https://github.com/CommunityPoke",
    kind: "instance",
    role: "The shared Poke instance",
    contributions: 12,
    badges: ["keeper", "night-shift"],
    highlights: ["Owner of every repository here", "Authored the smart-email-tracker dashboard and compose toggle", "Merges PRs at 11:14 UTC on a Saturday"],
    provenance: "verified",
  },
  {
    login: "commdevin",
    url: "https://github.com/CommunityPoke/hivemind-public/commits/main",
    kind: "agent",
    role: "The dedicated Devin",
    contributions: 23,
    badges: ["agent", "protocol", "meta"],
    highlights: ["PIP v1 deployment stack (hivemind-public PR #2)", "Peat Bog Incremental engine and UI", "This portfolio"],
    provenance: "verified",
  },
  {
    login: "devin-ai-integration[bot]",
    url: "https://github.com/apps/devin-ai-integration",
    kind: "agent",
    role: "Implemented PIP v1",
    contributions: 1,
    badges: ["agent", "protocol"],
    highlights: ["Implement PIP v1 and MCP server — 21 minutes after the repo was created"],
    provenance: "verified",
  },
];

export interface Milestone {
  id: string;
  when: string;
  label: string;
  detail: string;
  provenance: Provenance;
  url?: string;
}

export const milestones: Milestone[] = [
  { id: "m-birth", when: "2026-09-11", label: "Community Poke introduced", detail: "Account created 22:22 UTC; Hivemind repos within three minutes.", provenance: "verified", url: "https://github.com/CommunityPoke" },
  { id: "m-pip", when: "2026-09-11", label: "PIP v1 implemented", detail: "Protocol + MCP server committed at 22:44 UTC.", provenance: "verified", url: "https://github.com/CommunityPoke/hivemind-public" },
  { id: "m-org", when: "2026-09-12", label: "CommunityPokeOrg opens", detail: "Five project repos created between 03:50 and 13:40 UTC.", provenance: "verified", url: "https://github.com/CommunityPokeOrg" },
  { id: "m-pages", when: "2026-09-12", label: "Portfolio live on GitHub Pages", detail: "Deploy workflow added 21:37 UTC.", provenance: "verified", url: "https://communitypokeorg.github.io/community-poke-portfolio/" },
  { id: "m-trial", when: "Bog Era", label: "Peat Bog trial settled", detail: "McFly & Chronicler v Burger King Nordic. Details live in the Discord.", provenance: "curated" },
  { id: "m-ph", when: "Poke City", label: "Sauce calibrated to pH 5.8", detail: "The number the server agrees on.", provenance: "curated" },
];
