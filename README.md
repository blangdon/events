# WHATSON.EXE — Christchurch & Canterbury

A single-page, departures-board style list of upcoming events in Christchurch and Canterbury, split into Family & Kids, Adults, and Beyond Canterbury.

- Everything lives in `index.html` (no build step).
- Events are in the `EVENTS` array near the bottom of the file. Each entry:
  `{c:"family"|"adult"|"away", d:"YYYY-MM-DD", e:"YYYY-MM-DD" (optional end), when, what, url, where, note, tags:["free","sold","tbc","r18","sport"]}`
- Past events show as DEPARTED automatically based on today's date.
- Fuzzy search: press `/` to focus, `Esc` to clear.

Deployed as a static site (Netlify reads `netlify.toml`, publish directory is the repo root).
