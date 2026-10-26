# tv-launcher

Apple TV-style home launcher for a Samsung Tizen TV (package `StuHomeLnc`).
Install `HomeLauncher.wgt` once. After that, edit **`config.json`** in this repo; the TV picks up the change the next time the launcher opens or comes back to the front.

## Edit on github.com (no tools needed)
1. Open `config.json` and click the pencil (Edit).
2. Change it, then **Commit changes** on `main`.
3. On the TV, open another app and come back to Home (or restart the launcher). Changes usually show within about 5 minutes (GitHub's raw-file cache).

## config.json
```json
{
  "apps": [ { "name": "YouTube", "id": "9Ur5IzDKqV.TizenYouTube", "match": ["youtube"], "glyph": "youtube" } ],
  "wallpapers": ["https://raw.githubusercontent.com/stuarth89/tv-launcher/main/wallpapers/wall0.jpg"],
  "wallpaper": 0,
  "rotateMinutes": 10,
  "theme": { "scrim": 0.62, "fontSize": 110, "dimOpacity": 0.6 }
}
```
- **apps**: the list, top to bottom. Reorder or delete entries to change it.
  - `name`: text shown. `id`: Tizen app ID (may be `null`). `alt`: extra IDs to try.
  - `match`: words to find the app by name on the TV if the ID fails.
  - `glyph`: built-in icon: `youtube`, `netflix`, `spotify`, `coupang`, `apple`, `disney`, `prime`, `tving`, `wavve`. Or use `"icon": "<image URL>"` or `"svg": "<svg ...>"`. With none, the first letter is shown.
  - To find a real ID: on the TV, press ▶ to the grid icon; it lists every installed app with its ID.
- **wallpapers**: image URLs. To add one, upload a 1920×1080 JPEG (keep it under ~500 KB) to `wallpapers/` and add its URL.
- **wallpaper**: a number (0 = first) to fix one; `"rotate"` to cycle every `rotateMinutes`. If omitted, the wallpaper icon choice on the TV is remembered.
- **theme.scrim**: darkness of the left side, 0–1. **fontSize**: app name size in px. **dimOpacity**: opacity of non-selected names, 0–1.

A broken `config.json` (invalid JSON or no apps) is ignored, and the TV keeps the last good one. Check edits at jsonlint.com if unsure.

## Changes that still need a reinstall
Code in `js/`, `css/`, `index.html` and `config.xml` is bundled in the .wgt. Changing those means rebuilding and reinstalling. Only `config.json` and the wallpapers are live.
