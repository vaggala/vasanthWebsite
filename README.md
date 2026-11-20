# vasanthaggala.com

My personal portfolio site. It's built by hand with plain HTML, CSS, and JavaScript, with no framework or build step, and it's deployed on Vercel.

**Live:** https://vasanthaggala.com

## Features

- **One page, top to bottom.** About → Experience → School → Projects → Contact, with a sticky header that highlights the section you're reading.
- **Everything visible.** Every role's bullets and every featured project's details are on the page; no clicks needed to read them.
- **Light and dark.** Follows the visitor's system setting, using color variables defined once in `styles.css`.
- **No framework.** Plain HTML and CSS, plus a few lines of JavaScript for the nav highlight.

## Structure

```
index.html   The whole portfolio
resume.html  Embedded PDF résumé with a download link
styles.css   All styles (Satoshi font, light/dark tokens)
scripts.js   Highlights the current section in the nav
assets/      Photo, logos, font, résumé PDF
```

## Run locally

There's no build step. Serve the folder with any static server:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

Hosted on Vercel as a static site.
