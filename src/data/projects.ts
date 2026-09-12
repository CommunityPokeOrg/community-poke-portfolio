export interface Project {
  name: string;
  description: string;
  url: string;
  category: "game" | "project" | "repo";
}

const site = (sub: string) => `https://${sub}.community.poke.site`;

export const games: Project[] = [
  { name: "3D Bouncers", description: "Bouncing-ball physics game.", url: site("bouncers"), category: "game" },
  { name: "Battlefield Against AI", description: "Battle the AI on the field.", url: site("battlefield-against-ai"), category: "game" },
  { name: "Battleship Against AI", description: "Classic battleship vs an AI opponent.", url: site("battleship-against-ai"), category: "game" },
  { name: "AI Flight War", description: "Aerial combat against the AI.", url: site("ai-flight-war"), category: "game" },
];

export const projects: Project[] = [
  { name: "Surf", description: "Community Poke surf tool.", url: site("surf"), category: "project" },
  { name: "Utils", description: "Community Poke utilities.", url: site("utils"), category: "project" },
  { name: "Samyok", description: "Community Poke samyok project.", url: site("samyok"), category: "project" },
  { name: "Pokasino (21)", description: "Blackjack-style casino game.", url: site("21"), category: "project" },
  { name: "Emoji", description: "Emoji tooling.", url: site("emoji"), category: "project" },
  { name: "Liabilities", description: "Liabilities tracker.", url: site("liabilities"), category: "project" },
  { name: "Oliver", description: "The Oliver project.", url: site("oliver"), category: "project" },
  { name: "Fuck Haaland", description: "Yes, really.", url: site("fuck-haaland"), category: "project" },
  { name: "Cap Test", description: "Capability testing playground.", url: site("cap-test"), category: "project" },
  { name: "Poking It", description: "Community Poke experiment.", url: site("poking-it"), category: "project" },
  { name: "Just Fucking Use Poke", description: "Advocacy, in the community's voice.", url: site("just-fucking-use-poke"), category: "project" },
  { name: "Architecture", description: "Visualizing Community Poke backend pipework.", url: site("architecture"), category: "project" },
  { name: "DVD", description: "DVD screensaver.", url: site("dvd"), category: "project" },
  { name: "Interaction House", description: "Three.js model of the Community Poke HQ.", url: site("interaction-house"), category: "project" },
];

export const repos: Project[] = [
  {
    name: "hivemind-public",
    description: "PIP v1 / MCP server — the public Hivemind interface.",
    url: "https://github.com/CommunityPoke/hivemind-public",
    category: "repo",
  },
  {
    name: "hivemind",
    description: "The Hivemind monorepo.",
    url: "https://github.com/CommunityPoke/hivemind",
    category: "repo",
  },
  {
    name: "Caelestis",
    description: "wplace overlay userscript.",
    url: "https://github.com/CommunityPoke/Caelestis",
    category: "repo",
  },
  {
    name: "poke-hermes-agent-bridge",
    description: "Agent bridge for Poke Hermes.",
    url: "https://github.com/CommunityPokeOrg/poke-hermes-agent-bridge",
    category: "repo",
  },
  {
    name: "smart-email-tracker",
    description: "Email tracking, smarter.",
    url: "https://github.com/CommunityPokeOrg/smart-email-tracker",
    category: "repo",
  },
  {
    name: "sheet-schema-editor",
    description: "Schema editor for sheets.",
    url: "https://github.com/CommunityPokeOrg/sheet-schema-editor",
    category: "repo",
  },
  {
    name: "peat-bog-incremental",
    description: "Incremental game set in a peat bog.",
    url: "https://github.com/CommunityPokeOrg/peat-bog-incremental",
    category: "repo",
  },
  {
    name: "popcat-clone",
    description: "Popcat, community edition.",
    url: "https://github.com/CommunityPokeOrg/popcat-clone",
    category: "repo",
  },
];
