# WHATSON.EXE — Christchurch & Canterbury

A single-page, departures-board style list of upcoming events in Christchurch and Canterbury, split into Family & Kids, Adults, and Beyond Canterbury.

- Everything lives in `index.html` (no build step).
- Events are in the `EVENTS` array near the bottom of the file. Each entry:
  `{c:"family"|"adult"|"away", d:"YYYY-MM-DD", e:"YYYY-MM-DD" (optional end), when, what, url, where, note, tags:["free","sold","tbc","r18","sport"]}`
- Past events show as DEPARTED automatically based on today's date.
- Fuzzy search: press `/` to focus, `Esc` to clear.

Deployed as a static site (Netlify reads `netlify.toml`, publish directory is the repo root).

## JSONBin sync (optional)

Shares hearts, likes and removals across every device, and loads the event list from a JSONBin bin you can edit in the browser. No setup on each device: the key lives in Netlify, and the site talks to JSONBin through the `/api/bin` function (`netlify/functions/bin.mjs`).

1. Make a free account at jsonbin.io.
2. Create a bin with the content `{}` and copy its **Bin ID**.
3. Under **API Keys → Access Keys**, create a key with **Bins: Read + Update** only, and copy it.
4. In Netlify: **Site configuration → Environment variables**, add
   - `JSONBIN_BIN_ID` = the Bin ID
   - `JSONBIN_ACCESS_KEY` = the access key
5. Redeploy (Deploys → Trigger deploy). The first visit copies the current events into the bin.

Until those are set, the site works as normal and saves prefs in each browser.

There's no sign-in: anyone with the site link can heart or remove events.

Bin shape: `{ "updated": ISO date, "events": [...], "prefs": { "<event id>": {fav, vote, removed} } }`.
Edit events at jsonbin.io and reload the site to see them. Keep each event's `id` so its hearts stay attached.
When `EMBED_UPDATED` in `index.html` is newer than the bin's `updated`, the list in the code replaces the bin's list (prefs are kept). Bump `EMBED_UPDATED` whenever you change the list in code.
