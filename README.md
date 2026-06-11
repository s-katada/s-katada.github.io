# s-katada.github.io

https://s-katada.github.io — 自己紹介ペライチページ。
苗字の「片田」にちなんだ片田舎。ポツンと一軒家の庭にデスクを出して、
自作キーボード([claw44](https://github.com/yfuku/claw44) / 小人キー)をカタカタ打ちながら開発している風景。
クリックするとリングが広がる。

## Stack

- React + **Vite+** (`vp`) + TypeScript
- Node.js 24 (LTS) — `flake.nix` + `direnv` で管理
- GitHub Pages — GitHub Actions で自動デプロイ

[Vite+](https://viteplus.dev) は dev server / build / lint / format / 型チェックを
`vp` コマンドひとつに統合した VoidZero 製ツールチェーン。
`@vitejs/plugin-react` などの Vite プラグインは package.json の `overrides`
(`vite` → `@voidzero-dev/vite-plus-core`) 経由でそのまま動く。

## Development

```sh
direnv allow   # 初回のみ。以降ディレクトリに入ると自動で dev shell が有効になる
npm install
npm run dev    # = vp dev
```

direnv を使わない場合は `nix develop --command npm run dev` でも可。

## Check / Build / Preview

```sh
npm run check    # = vp check (format + lint + 型チェック)
npm run build    # = vp check && vp build
npm run preview  # = vp preview
```

## Deploy

`main` に push すると GitHub Actions がビルドして GitHub Pages へ自動デプロイする。

## Customize

表示する名前・肩書き・リンクは `src/config.ts` に集約してある。
