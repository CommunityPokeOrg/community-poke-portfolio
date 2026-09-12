export type Category = "game" | "project" | "repo";

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  category: Category;
  tags: string[];
  /** Owner/name for GitHub repos; used to hydrate live stats. */
  github?: string;
}

const site = (sub: string) => `https://${sub}.community.poke.site`;

export const games: Project[] = [
  { id: "bouncers", name: "3D Bouncers", description: "Bouncing-ball physics playground in three dimensions.", url: site("bouncers"), category: "game", tags: ["3d", "physics"] },
  { id: "battlefield", name: "Battlefield Against AI", description: "Hold the field against an AI opponent.", url: site("battlefield-against-ai"), category: "game", tags: ["vs-ai", "strategy"] },
  { id: "battleship", name: "Battleship Against AI", description: "Classic battleship, opponent included.", url: site("battleship-against-ai"), category: "game", tags: ["vs-ai", "classic"] },
  { id: "flight-war", name: "AI Flight War", description: "Aerial combat against the machine.", url: site("ai-flight-war"), category: "game", tags: ["vs-ai", "arcade"] },
];

export const projects: Project[] = [
  { id: "surf", name: "Surf", description: "Community Poke surf tool.", url: site("surf"), category: "project", tags: ["tool"] },
  { id: "utils", name: "Utils", description: "Grab-bag of Community Poke utilities.", url: site("utils"), category: "project", tags: ["tool"] },
  { id: "samyok", name: "Samyok", description: "The Samyok project.", url: site("samyok"), category: "project", tags: ["experiment"] },
  { id: "pokasino", name: "Pokasino (21)", description: "Blackjack-style casino, house edge included.", url: site("21"), category: "project", tags: ["game", "cards"] },
  { id: "emoji", name: "Emoji", description: "Emoji tooling for the server.", url: site("emoji"), category: "project", tags: ["tool", "discord"] },
  { id: "liabilities", name: "Liabilities", description: "A liabilities tracker. Name chosen with care.", url: site("liabilities"), category: "project", tags: ["tool"] },
  { id: "oliver", name: "Oliver", description: "The Oliver project.", url: site("oliver"), category: "project", tags: ["experiment"] },
  { id: "haaland", name: "Fuck Haaland", description: "Yes, really.", url: site("fuck-haaland"), category: "project", tags: ["meme", "football"] },
  { id: "cap-test", name: "Cap Test", description: "Capability-testing playground for the instance.", url: site("cap-test"), category: "project", tags: ["experiment", "agents"] },
  { id: "poking-it", name: "Poking It", description: "A Community Poke experiment.", url: site("poking-it"), category: "project", tags: ["experiment"] },
  { id: "jfup", name: "Just Fucking Use Poke", description: "Advocacy, in the community's voice.", url: site("just-fucking-use-poke"), category: "project", tags: ["meme", "advocacy"] },
  { id: "architecture", name: "Architecture", description: "Visualising the Community Poke backend pipework.", url: site("architecture"), category: "project", tags: ["viz", "infra"] },
  { id: "dvd", name: "DVD", description: "The screensaver. It will hit the corner eventually.", url: site("dvd"), category: "project", tags: ["meme", "viz"] },
  { id: "interaction-house", name: "Interaction House", description: "Three.js model of the Community Poke HQ.", url: site("interaction-house"), category: "project", tags: ["3d", "viz"] },
];

export const repos: Project[] = [
  { id: "hivemind-public", name: "hivemind-public", description: "Poke Interconnect Protocol (PIP v1) and Poke-compatible MCP server — the public Hivemind interface.", url: "https://github.com/CommunityPoke/hivemind-public", category: "repo", tags: ["python", "mcp", "protocol"], github: "CommunityPoke/hivemind-public" },
  { id: "hivemind", name: "hivemind", description: "The Hivemind monorepo.", url: "https://github.com/CommunityPoke/hivemind", category: "repo", tags: ["protocol"], github: "CommunityPoke/hivemind" },
  { id: "hermes-bridge", name: "poke-hermes-agent-bridge", description: "Agent-to-agent bridge letting Poke trigger the Nous Research Hermes agent.", url: "https://github.com/CommunityPokeOrg/poke-hermes-agent-bridge", category: "repo", tags: ["agents", "bridge"], github: "CommunityPokeOrg/poke-hermes-agent-bridge" },
  { id: "smart-email-tracker", name: "smart-email-tracker", description: "Privacy-aware email open tracking that filters proxy prefetches, MPP, scanners and self-opens.", url: "https://github.com/CommunityPokeOrg/smart-email-tracker", category: "repo", tags: ["python", "privacy"], github: "CommunityPokeOrg/smart-email-tracker" },
  { id: "sheet-schema-editor", name: "sheet-schema-editor", description: "React library + UI for uploading, schema-mapping and exporting CSV/XLSX data.", url: "https://github.com/CommunityPokeOrg/sheet-schema-editor", category: "repo", tags: ["typescript", "react", "library"], github: "CommunityPokeOrg/sheet-schema-editor" },
  { id: "peat-bog-incremental", name: "peat-bog-incremental", description: "Incremental clicker about harvesting peat bog compute broth and cooling server racks.", url: "https://github.com/CommunityPokeOrg/peat-bog-incremental", category: "repo", tags: ["typescript", "game", "lore"], github: "CommunityPokeOrg/peat-bog-incremental" },
  { id: "popcat-clone", name: "popcat-clone", description: "Popcat, community edition: animated mouth, Web Audio pops, click counter.", url: "https://github.com/CommunityPokeOrg/popcat-clone", category: "repo", tags: ["typescript", "game", "meme"], github: "CommunityPokeOrg/popcat-clone" },
  { id: "portfolio", name: "community-poke-portfolio", description: "This site. Vite + React, deployed to GitHub Pages.", url: "https://github.com/CommunityPokeOrg/community-poke-portfolio", category: "repo", tags: ["typescript", "react", "meta"], github: "CommunityPokeOrg/community-poke-portfolio" },
];

export const allProjects: Project[] = [...games, ...projects, ...repos];

export const categoryLabel: Record<Category, string> = {
  game: "Games",
  project: "Projects",
  repo: "Repositories",
};
