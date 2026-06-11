import type { CSSProperties } from "react";
import { profile } from "./config";
import { ParallaxDriver } from "./components/Parallax";
import { Scene } from "./components/Scene";
import { GitHubIcon, SproutIcon, XIcon } from "./components/icons";

const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export default function App() {
  const year = new Date().getFullYear();

  return (
    <>
      <Scene />
      <ParallaxDriver />

      <main className="hero">
        <p className="welcome reveal" style={delay(0.05)}>
          {profile.welcome}
        </p>
        <p className="hello reveal" style={delay(0.2)}>
          {profile.greeting}
        </p>
        <h1 className="name reveal" style={delay(0.35)}>
          {profile.name}
          <SproutIcon />
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

      <footer className="foot reveal" style={delay(0.95)}>
        © {year} {profile.name} · built with react + vite+
      </footer>

      <div className="noise" aria-hidden="true" />
    </>
  );
}
