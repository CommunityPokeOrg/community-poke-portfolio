import { site } from "../data/site";
import "./Footer.css";

export function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="wrap footer__inner">
        <div className="footer__values">
          {site.values.map((v) => (
            <div key={v.key} className="footer__value">
              <p className="footer__value-label">{v.label}</p>
              <p className="footer__value-detail">{v.detail}</p>
            </div>
          ))}
        </div>
        <div className="footer__meta mono">
          <p>
            {site.name} · {site.tagline}
          </p>
          <p>
            {site.orgs.map((o, i) => (
              <span key={o.login}>
                {i > 0 && " · "}
                <a href={o.url} target="_blank" rel="noreferrer">
                  {o.login}
                </a>{" "}
                <span className="footer__dim">({o.role})</span>
              </span>
            ))}
          </p>
          <p>
            <a href={site.repoUrl} target="_blank" rel="noreferrer">
              source
            </a>{" "}
            · deployed by GitHub Pages · <span className="footer__dim">canonical home: {site.canonicalDomain}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
