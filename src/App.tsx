import type { CSSProperties } from "react";
import { profile } from "./config";
import { ParallaxDriver } from "./components/Parallax";
import { Scene } from "./components/Scene";
import { Whistle } from "./components/Whistle";
import { GitHubIcon, SproutIcon, XIcon } from "./components/icons";

const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export default function App() {
  return (
    <>
      <Scene />
      <ParallaxDriver />
      <Whistle />

      <main className="hero">
        <p className="hello reveal" style={delay(0.05)}>
          {profile.greeting}
        </p>
        {/* hover アニメは内側の span に当てる: .reveal の forwards アニメと
            同じ要素で上書きし合うと opacity:0 に戻って名前が消える */}
        <h1 className="name reveal" style={delay(0.2)}>
          <span className="name-text">
            {profile.name}
            <SproutIcon />
          </span>
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
