# Klippod Site

Landing page for **Klippod** — https://jenovatech1.github.io/klippod-site/

## Downloads
- Android: https://play.google.com/store/apps/details?id=com.jenovatech.klippod
- Windows: https://lynk.id/jenovatech/g54elo0m0m8j

## Upload showcase videos (phone mockup)

1. Export vertical clips (9:16) from Klippod
2. Rename & drop into `assets/clips/`:

| File | Slot |
|------|------|
| `tts-title.mp4` | TTS + Title Card |
| `karaoke.mp4` | Karaoke Sweep |
| `neon-box.mp4` | Opus / Neon Box |
| `auto-cut.mp4` | Auto Cut + Hooks |
| `dual-split.mp4` | Dual Split |
| `emphasis-zoom.mp4` | Emphasis Zoom |
| `title-drop.mp4` | Title Card Drop |
| `punch-reveal.mp4` | Punch Reveal |

3. Optional poster: same name as `.jpg` (e.g. `tts-title.jpg`)
4. Edit titles/slots in `assets/js/clips-data.js` if needed
5. `git add` → commit → push

Keep each mp4 reasonably small for GitHub Pages.

## Local preview
Open `index.html` in a browser, or use any static server.
