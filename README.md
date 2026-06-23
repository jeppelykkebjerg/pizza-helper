# 🍕 Jons italienske pizzadej · Beregner

Lille webapp der skalerer [Jons italienske pizzadej](https://jonsmadklub.dk/blogs/opskrifter/italiensk-pizzadej) til præcis det antal pizzaer og dejboller du vil bage. Justerbar hydreringsprocent.

**Live:** https://jeppelykkebjerg.github.io/pizza-helper/

## Kør lokalt

```sh
npm install
npm run dev
```

## Deploy til GitHub Pages

```sh
npm run deploy
```

`gh-pages`-pakken bygger projektet og pusher `dist/`-mappen til en `gh-pages`-branch på GitHub. Første gang du gør det, skal du gå ind på repoet → **Settings → Pages → Source** og vælge `Deploy from a branch` med branch `gh-pages` og folder `/ (root)`.

Efter et par sekunder ligger appen på linket ovenfor.
