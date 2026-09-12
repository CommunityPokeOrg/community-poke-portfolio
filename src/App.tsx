import { games, projects, repos, type Project } from "./data/projects";

function Grid({ items }: { items: Project[] }) {
  return (
    <div className="grid">
      {items.map((p) => (
        <a key={p.name} className="card" href={p.url} target="_blank" rel="noreferrer">
          <h3>{p.name}</h3>
          <p>{p.description}</p>
        </a>
      ))}
    </div>
  );
}

export default function App() {
  return (
    <main>
      <header>
        <h1>Community Poke</h1>
        <p className="tagline">community slop, lovingly curated</p>
      </header>
      <section>
        <h2>Games</h2>
        <Grid items={games} />
      </section>
      <section>
        <h2>Projects</h2>
        <Grid items={projects} />
      </section>
      <section>
        <h2>Repositories</h2>
        <Grid items={repos} />
      </section>
      <footer>
        <p>
          Built in public by the Poke Community. Source:{" "}
          <a href="https://github.com/CommunityPokeOrg/community-poke-portfolio">
            CommunityPokeOrg/community-poke-portfolio
          </a>
        </p>
      </footer>
    </main>
  );
}
