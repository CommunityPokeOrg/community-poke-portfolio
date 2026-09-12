# Backup & Mirror Plan

This repo exists because `portfolio.community.poke.site` had no reachable code
when it was created (the domain resolves to Vercel but returns
`404 DEPLOYMENT_NOT_FOUND`). No Vercel/Poke credentials are available, so the
live site is hosted on **GitHub Pages**
(`communitypokeorg.github.io/community-poke-portfolio`); Vercel here is only
relevant as the *source* of the original deployment, not the live path. This
document describes how to import the real codebase once it becomes accessible,
and how to keep this repo in sync afterward.

## Step 0 — confirm the source is reachable

```bash
curl -sI https://portfolio.community.poke.site
```

If you get a real response (not `DEPLOYMENT_NOT_FOUND`), a deployment exists
and can potentially be pulled or cloned.

## Option A — pull from Vercel (preferred, if we have project access)

Requires the Vercel CLI and access to the Poke-hosted Vercel project/team.

```bash
npm i -g vercel
vercel login
cd /path/to/community-poke-portfolio
vercel link                 # select the portfolio project
vercel pull                 # writes .vercel/ + project env/settings
vercel env pull .env.local  # optional: pull env vars (do NOT commit)
```

`vercel pull` gives project settings, not source. To get source, either:

- Find the connected Git repo in the Vercel project settings
  (**Settings → Git**) and clone it, or
- Download the deployment's source from the Vercel dashboard
  (**Deployments → ⋯ → Source / Build output**) if exposed.

If only the build output is obtainable, mirror that instead (Option C).

## Option B — mirror from a Git remote

If the real site has its own repo (GitHub or elsewhere):

```bash
git remote add upstream <url-of-real-repo>
git fetch upstream
# either merge into main or keep as a dedicated mirror branch:
git push origin upstream/main:refs/heads/mirror
```

Decide per situation whether upstream history should replace this scaffold
(force of nature import) or live alongside it as a `mirror` branch.

## Option C — copy build output

If only the deployed static assets are reachable (no source repo, no Vercel
access):

```bash
wget --mirror --convert-links --adjust-extension \
     --page-requisites --no-parent \
     https://portfolio.community.poke.site
```

Commit the result under a `mirror/` directory or a `snapshot-YYYY-MM-DD`
branch, clearly labeled as a built-assets snapshot rather than source.

## Keeping it in sync

- **Manual:** re-run Option A/B after any notable deployment.
- **Scheduled (optional):** a GitHub Action on `schedule:` (e.g. daily cron)
  that fetches the upstream remote and opens/updates a sync PR if the diff is
  non-empty. Describe-only for now — set it up once the upstream URL is known.
  Sketch:

  ```yaml
  on:
    schedule: [{ cron: "0 6 * * *" }]
    workflow_dispatch:
  steps:
    - uses: actions/checkout@v4
    - run: |
        git remote add upstream "$UPSTREAM_URL"
        git fetch upstream
        # diff upstream/main vs mirror; if changed, push mirror branch
        # and open a PR via gh / peter-evans/create-pull-request
  ```

## Open questions

- **Who owns the Poke-hosted Vercel project** that
  `portfolio.community.poke.site` points at? Backup access (Vercel team invite
  or the connected Git repo URL) is needed for Option A/B. Track this with the
  community admins.
- Does a source repo for the current deployment already exist under
  `CommunityPoke` / `CommunityPokeOrg` that just isn't linked in the domain
  config?
