import { describe, expect, it } from "vitest";
import { badges, members, milestones, repoSnapshot } from "./hallOfFame";
import { lore } from "./lore";
import { allProjects } from "./projects";
import { quips } from "./quips";

const COMMUNITY_HOSTS = ["github.com/CommunityPoke", "github.com/orgs/CommunityPokeOrg", "github.com/CommunityPokeOrg", "communitypokeorg.github.io", "poke.site"];

const unique = <T>(xs: T[]) => new Set(xs).size === xs.length;

describe("catalog", () => {
  it("has unique ids and absolute urls", () => {
    expect(unique(allProjects.map((p) => p.id))).toBe(true);
    for (const p of allProjects) expect(p.url).toMatch(/^https:\/\//);
  });
});

describe("lore archive", () => {
  it("has unique ids", () => {
    expect(unique(lore.map((l) => l.id))).toBe(true);
  });

  it("verified entries link to community-owned sources", () => {
    for (const l of lore.filter((l) => l.provenance === "verified")) {
      expect(l.source, l.id).toBeDefined();
      expect(COMMUNITY_HOSTS.some((h) => l.source!.url.includes(h)), `${l.id}: ${l.source!.url}`).toBe(true);
    }
  });

  it("curated entries never claim a source", () => {
    for (const l of lore.filter((l) => l.provenance === "curated")) expect(l.source, l.id).toBeUndefined();
  });
});

describe("quip reel", () => {
  it("every quip cites a community README", () => {
    expect(unique(quips.map((q) => q.id))).toBe(true);
    for (const q of quips) expect(COMMUNITY_HOSTS.some((h) => q.source.url.includes(h)), q.id).toBe(true);
  });
});

describe("hall of fame", () => {
  it("only references defined badges", () => {
    for (const m of members) for (const b of m.badges) expect(badges[b], `${m.login}:${b}`).toBeDefined();
  });

  it("snapshot repos belong to the community", () => {
    for (const r of repoSnapshot) expect(r.fullName).toMatch(/^(CommunityPoke|CommunityPokeOrg)\//);
  });

  it("verified milestones carry a url", () => {
    for (const m of milestones.filter((m) => m.provenance === "verified")) expect(m.url, m.id).toMatch(/^https:\/\//);
  });
});
