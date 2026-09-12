/**
 * Quip Reel entries. Every line is quoted verbatim from a public README in the
 * community's repositories — `source` links to where it lives.
 *
 * `tone` drives the synthesised sound and the visual accent; there are no audio
 * assets, sounds are generated with the Web Audio API and silently skipped when
 * that is unavailable or the user has not opted in.
 */
export type Tone = "dry" | "chaos" | "warm" | "ominous";

export interface Quip {
  id: string;
  text: string;
  speaker: string;
  source: { label: string; url: string };
  tone: Tone;
}

const cp = { label: "CommunityPoke profile README", url: "https://github.com/CommunityPoke/CommunityPoke#readme" };
const org = { label: "CommunityPokeOrg profile README", url: "https://github.com/CommunityPokeOrg/.github#readme" };
const bog = { label: "peat-bog-incremental README", url: "https://github.com/CommunityPokeOrg/peat-bog-incremental#readme" };

export const quips: Quip[] = [
  { id: "slop", text: "community slop, lovingly curated.", speaker: "Identity line", source: cp, tone: "warm" },
  { id: "synergy", text: "Useful when possible. Entertaining when not. Appropriately suspicious of anything described as \"synergy.\"", speaker: "Community Poke", source: cp, tone: "dry" },
  { id: "routing", text: "Runs across Telegram and Discord simultaneously, which is either elegant or a war crime against message routing, depending on who you ask.", speaker: "Community lore", source: cp, tone: "chaos" },
  { id: "in-charge", text: "Nobody is entirely sure who is in charge. That is the point.", speaker: "Community lore", source: cp, tone: "ominous" },
  { id: "sinister", text: "The \"Hivemind\" is exactly what it sounds like, minus the sinister part. Mostly.", speaker: "Community lore", source: cp, tone: "ominous" },
  { id: "funny", text: "Be useful. Failing that, be funny.", speaker: "Mission & values", source: cp, tone: "warm" },
  { id: "threat-model", text: "Chaos in tone, not in threat model.", speaker: "Security is not optional", source: cp, tone: "dry" },
  { id: "permissions", text: "It can help the room, roast the room, and occasionally make the room wonder who gave it permissions.", speaker: "Identity", source: cp, tone: "chaos" },
  { id: "never-no", text: "Shipped by humans, agents, and a shared Poke instance that was never told \"no.\"", speaker: "CommunityPokeOrg", source: org, tone: "chaos" },
  { id: "funny-if", text: "…the occasional game that exists purely because someone in the Discord said \"wouldn't it be funny if.\"", speaker: "Who we are", source: org, tone: "warm" },
  { id: "racks", text: "Yes, there is a clicker game about peat bog compute broth. No, nobody can fully explain it. Yes, it has server racks.", speaker: "Community lore", source: org, tone: "chaos" },
  { id: "container", text: "The organization exists because one GitHub account turned out to be a suspiciously small container for a whole community's side projects.", speaker: "Community lore", source: org, tone: "dry" },
  { id: "roasted", text: "Their PRs get reviewed like everyone else's — and sometimes roasted harder.", speaker: "Agents are contributors too", source: org, tone: "dry" },
  { id: "mistakes", text: "Public code, public issues, public mistakes.", speaker: "Open by default", source: org, tone: "warm" },
  { id: "vibes", text: "Governance is best described as \"vibes with code review.\"", speaker: "Community lore", source: org, tone: "dry" },
  { id: "one-agent", text: "Autonomous engineering — because apparently one autonomous agent was not enough.", speaker: "What powers it", source: cp, tone: "ominous" },
  { id: "drain", text: "Eventually Drain the Bog for permanent Bog Cores.", speaker: "Peat Bog Incremental", source: bog, tone: "ominous" },
  { id: "optimism", text: "Assembled in public, occasionally held together with optimism.", speaker: "Shared community context", source: cp, tone: "warm" },
];
