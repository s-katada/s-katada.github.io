# s-katada.github.io

https://s-katada.github.io — 自己紹介ペライチページ。

## Stack

- React + Vite + TypeScript
- Node.js 24 (LTS) — `flake.nix` + `direnv` で管理
- GitHub Pages — GitHub Actions で自動デプロイ

## Development

```sh
direnv allow   # 初回のみ。以降ディレクトリに入ると自動で dev shell が有効になる
npm install
npm run dev
```

direnv を使わない場合は `nix develop --command npm run dev` でも可。

## Build / Preview

```sh
npm run build
npm run preview
```

## Deploy

`main` に push すると GitHub Actions がビルドして GitHub Pages へ自動デプロイする。

## Customize

表示する名前・肩書き・リンクは `src/config.ts` に集約してある。
