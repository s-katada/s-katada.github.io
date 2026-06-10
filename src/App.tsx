import type { CSSProperties } from "react";
import { profile } from "./config";
import { Starfield } from "./components/Starfield";
import { CursorGlow } from "./components/CursorGlow";
import { GitHubIcon, XIcon } from "./components/icons";

const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export default function App() {
  const year = new Date().getFullYear();

  return (
    <>
      <div className="backdrop" aria-hidden="true">
        <div className="aurora aurora-a" />
        <div className="aurora aurora-b" />
        <div className="aurora aurora-c" />
        <Starfield />
        <div className="grid-overlay" />
      </div>

      <CursorGlow />

      <main className="hero">
        <div className="halo" aria-hidden="true" />
        <p className="hello reveal" style={delay(0.1)}>
          {profile.greeting}
        </p>
        <h1 className="name reveal" style={delay(0.3)}>
          <span className="glitch" data-text={profile.name}>
            {profile.name}
          </span>
          <span className="caret" aria-hidden="true">
            _
          </span>
        </h1>
        <p className="role reveal" style={delay(0.5)}>
          {profile.role}
        </p>
        <nav className="links reveal" style={delay(0.7)} aria-label="Social links">
          <a
            className="link-btn github"
            href={profile.github.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon />
            <span>GitHub</span>
            <span className="at">@{profile.github.handle}</span>
          </a>
          <a className="link-btn x" href={profile.x.url} target="_blank" rel="noopener noreferrer">
            <XIcon />
            <span>X</span>
            <span className="at">@{profile.x.handle}</span>
          </a>
        </nav>
      </main>

      <footer className="foot reveal" style={delay(1)}>
        © {year} {profile.name} · built with react + vite+
      </footer>

      <div className="noise" aria-hidden="true" />
    </>
  );
}
