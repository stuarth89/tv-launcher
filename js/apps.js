/* Edit this list to change the home list. Order = order on screen.
 * id: Tizen app ID for tizen.application.launch ("verified" = found in public Samsung ID lists).
 *     null = unverified; the launcher finds the app by name via getAppsInfo().
 * glyph: key into GLYPHS in main.js (white monochrome SVG); missing glyph => text initial.
 * Press the grid icon (top right) to see every installed app and its real ID. */
window.LAUNCHER_APPS = [
  { name: "YouTube",      id: "9Ur5IzDKqV.TizenYouTube",            match: ["youtube"],               glyph: "youtube" }, // verified
  { name: "Netflix",      id: "RN1MCdNq8t.Netflix", alt: ["org.tizen.netflix-app"], match: ["netflix"], glyph: "netflix" }, // verified
  { name: "Spotify",      id: "3201606009684",                      match: ["spotify"],               glyph: "spotify" }, // Samsung store ID (homebridge-samsung-tizen list); name lookup is the fallback
  { name: "Coupang Play", id: null,                                 match: ["coupang", "쿠팡"],        glyph: "coupang" },
  { name: "Apple TV",     id: null,                                 match: ["apple tv"],              glyph: "apple" }
];
