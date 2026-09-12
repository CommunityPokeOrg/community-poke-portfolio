/**
 * The Lore Archive.
 *
 * Every entry carries a `provenance`:
 *  - "verified": backed by repository history / README content; `source` links to it.
 *  - "curated": server canon retold from the Discord. Names and details are as the
 *    community tells them, not something we can point a commit at.
 */
export type Provenance = "verified" | "curated";

export type Era = "genesis" | "hivemind" | "workshop" | "bog" | "canon";

export interface LoreEntry {
  id: string;
  era: Era;
  /** ISO date, or a lore-era label when there is no real timestamp. */
  when: string;
  title: string;
  summary: string;
  body: string[];
  provenance: Provenance;
  tags: string[];
  source?: { label: string; url: string };
  /** Monospace "artifact" shown in the detail panel — a hash, a value, a coordinate. */
  artifact?: string;
}

export const eras: Record<Era, { label: string; blurb: string }> = {
  genesis: { label: "Genesis", blurb: "One question nobody fully thought through." },
  hivemind: { label: "Hivemind", blurb: "Instances learn to talk to each other." },
  workshop: { label: "The Workshop", blurb: "Repos multiply. Agents commit. Humans review." },
  bog: { label: "The Peat Bog", blurb: "Compute broth, server racks, and a trial." },
  canon: { label: "Poke City Canon", blurb: "Server lore, as told in the Discord." },
};

export const lore: LoreEntry[] = [
  {
    id: "birth",
    era: "genesis",
    when: "2026-09-11",
    title: "\"What if the assistant was for everyone?\"",
    summary: "Community Poke is introduced: a shared Poke Ultra instance in the official Poke Community Discord.",
    body: [
      "The CommunityPoke GitHub account is created at 22:22 UTC and, minutes later, commits \"Introduce Community Poke\".",
      "The instance bridges TDLib/Telegram on one side and Discord on the other. Depending on who you ask this is either elegant or a war crime against message routing.",
      "Identity, as later written down: community slop, lovingly curated.",
    ],
    provenance: "verified",
    tags: ["origin", "discord", "telegram"],
    source: { label: "CommunityPoke/CommunityPoke @ d39206d", url: "https://github.com/CommunityPoke/CommunityPoke/commit/d39206d" },
    artifact: "d39206d · Introduce Community Poke",
  },
  {
    id: "hivemind-seed",
    era: "hivemind",
    when: "2026-09-11",
    title: "The Hivemind is seeded",
    summary: "Two repos in three minutes: `hivemind` at 22:20, `hivemind-public` at 22:23.",
    body: [
      "Hivemind is exactly what it sounds like, minus the sinister part. Mostly.",
      "The public repository becomes the home of the Poke Interconnect Protocol (PIP v1): discovery, signed messages, explicit scopes, revocable consent, idempotency.",
    ],
    provenance: "verified",
    tags: ["protocol", "pip", "mcp"],
    source: { label: "CommunityPoke/hivemind-public", url: "https://github.com/CommunityPoke/hivemind-public" },
  },
  {
    id: "pip-v1",
    era: "hivemind",
    when: "2026-09-11",
    title: "PIP v1 lands, written by one agent on behalf of another",
    summary: "devin-ai-integration[bot] commits \"Implement PIP v1 and MCP server\" at 22:44 UTC — twenty-one minutes after the repo existed.",
    body: [
      "Commits authored by an autonomous agent on behalf of a community-run assistant are considered normal here.",
      "The next morning PR #2 adds the container image, compose stack, deploy script and systemd units. Nobody is entirely sure who is in charge. That is the point.",
    ],
    provenance: "verified",
    tags: ["devin", "agents", "deploy"],
    source: { label: "hivemind-public @ efb1bf8", url: "https://github.com/CommunityPoke/hivemind-public/commit/efb1bf8" },
    artifact: "efb1bf8 · Implement PIP v1 and MCP server",
  },
  {
    id: "night-shift",
    era: "workshop",
    when: "2026-09-12",
    title: "The 03:50 night shift",
    summary: "smart-email-tracker (03:50) and peat-bog-incremental (03:53) are created three minutes apart, both fully implemented within the hour.",
    body: [
      "One is privacy-aware email open tracking with proxy-prefetch and scanner filtering.",
      "The other is a clicker game about harvesting peat bog compute broth. Yes, it has server racks. No, nobody can fully explain it.",
      "Both were shipped before most of the server woke up.",
    ],
    provenance: "verified",
    tags: ["devin", "python", "game"],
    source: { label: "CommunityPokeOrg repositories", url: "https://github.com/orgs/CommunityPokeOrg/repositories" },
  },
  {
    id: "bog-broth",
    era: "bog",
    when: "2026-09-12",
    title: "Compute broth is discovered",
    summary: "The Peat Bog Incremental engine ships: scoop broth, build vats, stand up racks, and keep cooling ≥ heat or the racks throttle.",
    body: [
      "Compute production is multiplied by min(1, cooling / heat). Watch the thermal bar.",
      "Once a run earns 1,000,000 compute you may Drain the Bog for floor(sqrt(total / 1e6)) Bog Cores. Cores are permanent. So is the smell.",
    ],
    provenance: "verified",
    tags: ["game", "peat-bog", "thermal"],
    source: { label: "peat-bog-incremental README", url: "https://github.com/CommunityPokeOrg/peat-bog-incremental#readme" },
    artifact: "compute *= min(1, cooling / heat)",
  },
  {
    id: "bog-trial",
    era: "bog",
    when: "Bog Era",
    title: "The Great Peat Bog trial: McFly & Chronicler v Burger King Nordic",
    summary: "The settlement that ended the Bog's most litigated season, as retold in the server.",
    body: [
      "Server canon holds that the dispute over the Bog was settled rather than judged — the parties named McFly and Chronicler on one side, Burger King Nordic on the other.",
      "What the settlement actually said is not recorded anywhere we can link. Retellings agree on one thing: the Bog stayed communal.",
      "Filed under canon, not history. If you have the original messages, open a PR.",
    ],
    provenance: "curated",
    tags: ["peat-bog", "trial", "canon"],
  },
  {
    id: "pentti",
    era: "canon",
    when: "Poke City",
    title: "Pentti's yellow Peltors",
    summary: "The hearing protection that became a uniform.",
    body: [
      "In Poke City lore Pentti is never seen without the yellow Peltors. Whether they were ever plugged into anything is disputed.",
      "The archive has the name, the colour and the model line. It does not have a photo. Contributions welcome.",
    ],
    provenance: "curated",
    tags: ["poke-city", "pentti", "canon"],
    artifact: "PELTOR · yellow · always on",
  },
  {
    id: "ph-5-8",
    era: "canon",
    when: "Poke City",
    title: "pH 5.8 sauce calibration",
    summary: "The one number Poke City agrees on.",
    body: [
      "Sauce is calibrated to pH 5.8. Not 5.7. Not 5.9. The community treats this with the seriousness other servers reserve for semver.",
      "Nobody has published the calibration procedure. The archive records the number and nothing else.",
    ],
    provenance: "curated",
    tags: ["poke-city", "sauce", "canon"],
    artifact: "pH 5.8 ± 0.0",
  },
  {
    id: "org-born",
    era: "workshop",
    when: "2026-09-12",
    title: "One account turns out to be a small container",
    summary: "CommunityPokeOrg gets a profile README at 16:27 UTC: \"shipped by humans, agents, and a shared Poke instance that was never told 'no'.\"",
    body: [
      "The organisation exists because one GitHub account turned out to be a suspiciously small container for a whole community's side projects.",
      "Values, in order: community first, open by default, agents are contributors too, privacy and safety matter, ship then polish.",
    ],
    provenance: "verified",
    tags: ["org", "readme"],
    source: { label: "CommunityPokeOrg/.github", url: "https://github.com/CommunityPokeOrg/.github" },
  },
  {
    id: "portfolio",
    era: "workshop",
    when: "2026-09-12",
    title: "The portfolio that had no code",
    summary: "portfolio.community.poke.site pointed at Vercel and returned 404 DEPLOYMENT_NOT_FOUND. So the community built one and put it on GitHub Pages.",
    body: [
      "Scaffolded at 18:51 UTC, deployed via Actions at 21:37, overhauled into the thing you are reading a few hours later.",
      "The custom domain remains the long-term target; DNS is owned elsewhere.",
    ],
    provenance: "verified",
    tags: ["meta", "pages"],
    source: { label: "community-poke-portfolio", url: "https://github.com/CommunityPokeOrg/community-poke-portfolio" },
    artifact: "404 DEPLOYMENT_NOT_FOUND → 200 OK",
  },
];

export const eraOrder: Era[] = ["genesis", "hivemind", "workshop", "bog", "canon"];

export const allTags = Array.from(new Set(lore.flatMap((l) => l.tags))).sort();
