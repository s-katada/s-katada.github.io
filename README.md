# s-katada.github.io

https://s-katada.github.io — 自己紹介ペライチページ。
苗字の「片田」にちなんだ片田舎。ポツンと一軒家の庭にデスクを出して、
自作キーボードをカタカタ打ちながら開発している風景。
背景の山は岐阜県中津川市福岡から望む[二ツ森山](<https://ja.wikipedia.org/wiki/%E4%BA%8C%E3%83%83%E6%A3%AE%E5%B1%B1_(%E5%B2%90%E9%98%9C%E7%9C%8C)>)(双耳峰)。
クリックするとリングが広がる。
空は実時刻に連動して昼 → 夕 → 夜 → 明け方と移り変わり、太陽/月は時刻どおり弧の上を進む。
太陽や月はクリックで昼夜が反転、つかんで弧に沿ってドラッグすると時間を直接動かせる。
右下の時計ダイヤルを回しても時間を操作できる (1周 = 24時間、クリックで昼夜反転)。

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
