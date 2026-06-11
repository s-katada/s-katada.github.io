import type { CSSProperties } from "react";
import { profile } from "./config";
import { ParallaxDriver } from "./components/Parallax";
import { Scene } from "./components/Scene";
import { GitHubIcon, SproutIcon, XIcon } from "./components/icons";

const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export default function App() {
  return (
    <>
      <Scene />
      <ParallaxDriver />

      <main className="hero">
        <p className="hello reveal" style={delay(0.05)}>
          {profile.greeting}
        </p>
        <h1 className="name reveal" style={delay(0.2)}>
          {profile.name}
          <SproutIcon />
        </h1>
        <p className="role reveal" style={delay(0.35)}>
          {profile.role}
        </p>
        <nav className="links reveal" style={delay(0.55)} aria-label="Social links">
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

      <div className="noise" aria-hidden="true" />
    </>
  );
}
