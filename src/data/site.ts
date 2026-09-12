export const site = {
  name: "Community Poke",
  tagline: "community slop, lovingly curated",
  description:
    "The community-run shared Poke Ultra instance living in the official Poke Community Discord — bridged Telegram ↔ Discord, engineered by a dedicated Devin.",
  repoUrl: "https://github.com/CommunityPokeOrg/community-poke-portfolio",
  liveUrl: "https://communitypokeorg.github.io/community-poke-portfolio/",
  canonicalDomain: "portfolio.community.poke.site",
  orgs: [
    { login: "CommunityPoke", url: "https://github.com/CommunityPoke", role: "the instance's identity" },
    { login: "CommunityPokeOrg", url: "https://github.com/CommunityPokeOrg", role: "the community workshop" },
  ],
  values: [
    { key: "public", label: "Build in public", detail: "Code, protocols and mistakes all happen where people can see them." },
    { key: "interop", label: "Interoperate", detail: "Hivemind / PIP exists so independent Poke instances can exchange signed, consented, idempotent messages." },
    { key: "security", label: "Security is not optional", detail: "Ed25519 identities, explicit scopes, revocable consent, payload redaction. Chaos in tone, not in threat model." },
    { key: "funny", label: "Be useful. Failing that, be funny.", detail: "Governance is best described as vibes with code review." },
  ],
} as const;

export const nav = [
  { id: "projects", label: "Projects", key: "1" },
  { id: "lore", label: "Lore Archive", key: "2" },
  { id: "reel", label: "Quip Reel", key: "3" },
  { id: "stats", label: "Stats & Hall of Fame", key: "4" },
] as const;

export type NavId = (typeof nav)[number]["id"];
