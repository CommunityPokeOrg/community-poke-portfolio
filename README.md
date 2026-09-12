# Community Poke Portfolio

Codebase and backup plan for the Community Poke Portfolio website
([portfolio.community.poke.site](https://portfolio.community.poke.site)) —
showcasing Community Poke projects, tools, and lore.

## What this is

The source code and backup/mirror plan for the Community Poke portfolio site:
a single page that catalogs the games, projects, and open-source repos produced
by the Poke Community.

## Live target site

The site is live at **https://communitypokeorg.github.io/community-poke-portfolio/**
(GitHub Pages, auto-deployed from `main` — see [Deploying](#deploying)). The
custom domain **https://portfolio.community.poke.site** remains the long-term
target.

**Status (as of 2026-09-12):** `portfolio.community.poke.site` resolves to
Vercel but has **no live deployment** — it returned `404 DEPLOYMENT_NOT_FOUND`
over plain HTTP with no TLS certificate. No Vercel/Poke hosting credentials
are available to this project, so the site is hosted on **GitHub Pages**
instead. This repository is therefore a **scaffold + backup plan**: no
existing code was imported because none was accessible. Once the real
deployment's code becomes reachable, follow [BACKUP_PLAN.md](BACKUP_PLAN.md)
to import it here.

## What it showcases

### Games

| Name | Link |
| --- | --- |
| 3D Bouncers | https://bouncers.community.poke.site |
| Battlefield Against AI | https://battlefield-against-ai.community.poke.site |
| Battleship Against AI | https://battleship-against-ai.community.poke.site |
| AI Flight War | https://ai-flight-war.community.poke.site |

### Projects

| Name | Link |
| --- | --- |
| Surf | https://surf.community.poke.site |
| Utils | https://utils.community.poke.site |
| Samyok | https://samyok.community.poke.site |
| Pokasino (21) | https://21.community.poke.site |
| Emoji | https://emoji.community.poke.site |
| Liabilities | https://liabilities.community.poke.site |
| Oliver | https://oliver.community.poke.site |
| Fuck Haaland | https://fuck-haaland.community.poke.site |
| Cap Test | https://cap-test.community.poke.site |
| Poking It | https://poking-it.community.poke.site |
| Just Fucking Use Poke | https://just-fucking-use-poke.community.poke.site |
| Architecture (backend pipework visualization) | https://architecture.community.poke.site |
| DVD (screensaver) | https://dvd.community.poke.site |
| Interaction House (Three.js HQ model) | https://interaction-house.community.poke.site |

### GitHub repos

| Repo | What it is |
| --- | --- |
| [CommunityPoke/hivemind-public](https://github.com/CommunityPoke/hivemind-public) | PIP v1 / MCP server |
| [CommunityPoke/hivemind](https://github.com/CommunityPoke/hivemind) | The Hivemind monorepo |
| [CommunityPoke/Caelestis](https://github.com/CommunityPoke/Caelestis) | wplace overlay userscript |
| [CommunityPokeOrg/poke-hermes-agent-bridge](https://github.com/CommunityPokeOrg/poke-hermes-agent-bridge) | Agent bridge |
| [CommunityPokeOrg/smart-email-tracker](https://github.com/CommunityPokeOrg/smart-email-tracker) | Email tracking |
| [CommunityPokeOrg/sheet-schema-editor](https://github.com/CommunityPokeOrg/sheet-schema-editor) | Sheet schema editor |
| [CommunityPokeOrg/peat-bog-incremental](https://github.com/CommunityPokeOrg/peat-bog-incremental) | Incremental game |
| [CommunityPokeOrg/popcat-clone](https://github.com/CommunityPokeOrg/popcat-clone) | Popcat clone |

### Lore

Community Poke is a **community-run shared Poke Ultra instance** in the
official Poke Community Discord — bridged TDLib/Telegram ↔ Discord, engineered
by a dedicated Devin.

- **Tagline:** *"community slop, lovingly curated"*
- **Values:** build in public · interoperate (Hivemind / PIP) · security is not
  optional · *be useful — failing that, be funny*
- **Governance:** vibes with code review

## Repository layout

```
├── BACKUP_PLAN.md         # how to import/mirror the real codebase
├── index.html             # Vite entry
├── package.json
├── src/
│   ├── App.tsx            # portfolio grid
│   ├── data/projects.ts   # project catalog (edit this to add entries)
│   ├── main.tsx
│   └── style.css
└── tsconfig.json
```

## Local dev

```bash
npm install
npm run dev      # dev server
npm run build    # typecheck + production build to dist/
```

## Deploying

The site auto-deploys to **GitHub Pages** on every push to `main` via
`.github/workflows/deploy.yml`:

- Live URL: https://communitypokeorg.github.io/community-poke-portfolio/
- Pages is configured with `build_type: workflow`; the workflow builds `dist/`
  with `VITE_BASE=/community-poke-portfolio/` and publishes it with
  `actions/deploy-pages`.

### Custom domain

`portfolio.community.poke.site` is the intended canonical domain, but the DNS
for `community.poke.site` is owned elsewhere and currently points at Vercel.
To switch it to this Pages deployment, the **domain owner** (whoever controls
DNS for `community.poke.site`) must:

1. Replace the existing Vercel-pointed record with a CNAME record:
   `portfolio.community.poke.site` → `communitypokeorg.github.io`
2. In this repo, set the custom domain under **Settings → Pages**, or via API:
   ```bash
   curl -X PUT -H "Authorization: Bearer $TOKEN" \
     https://api.github.com/repos/CommunityPokeOrg/community-poke-portfolio/pages \
     -d '{"cname":"portfolio.community.poke.site"}'
   ```
   then enable **Enforce HTTPS** once the certificate is issued.
3. Change `VITE_BASE` in `.github/workflows/deploy.yml` from
   `/community-poke-portfolio/` to `/` so asset paths resolve at the domain
   root.

## Backup & mirror plan

See [BACKUP_PLAN.md](BACKUP_PLAN.md) for how to import the real deployed
codebase once it becomes accessible, and how to keep this repo in sync.

## Contributing

Edit `src/data/projects.ts` to add or update portfolio entries. PRs welcome —
governance is vibes with code review.

## License

MIT — see [LICENSE](LICENSE).
