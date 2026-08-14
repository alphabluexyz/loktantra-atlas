# Polity Atlas

A dependency-free, single-page site that maps Indian political parties and
freedom-movement thinkers onto the country's core debates.

## Run it
- **Simplest:** double-click `index.html` (plain scripts, works offline).
- **Recommended:** serve the folder: `python3 -m http.server 8000` → http://localhost:8000

## File map
| File | Purpose |
|---|---|
| `index.html` | Page skeleton (structure only — no styling or logic) |
| `css/style.css` | All styling, commented by section; colours in `:root` at the top |
| `js/data.js` | **All content**: parties, figures, debates, map wording, donation settings |
| `js/app.js` | Logic that turns data into the page (you shouldn't need to touch it) |

## Common edits (all inside `js/data.js`)
- **Move a party:** find `{id:'BJP', …}` → change `x` / `y`
  - `x`: −10 state economy … +10 market economy
  - `y`: −10 secular reform … +10 faith & tradition
- **Add a party/figure:** copy any entry, give it a unique `id`, pick a `g` group
- **Rename axes/quadrants:** edit `AXES` and `QUADRANTS`
- **New debate:** copy one `DEBATES` entry; `leans` values run 0–100 toward side `b`
- **Colours:** `:root` in `css/style.css`; point/legend colours in `GROUPS`

## Adding a new page
1. Copy `index.html` → e.g. `methods.html`, edit its content.
2. Add `{ label:'Method', href:'methods.html' }` to `NAV` in `data.js`.
   The nav on every page updates automatically.

## Deploy (free)
- **Netlify Drop:** drag the folder onto app.netlify.com/drop
- **GitHub Pages:** push the folder to a repo → Settings → Pages → deploy from branch