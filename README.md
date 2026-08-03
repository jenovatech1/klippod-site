# Klippod Site

Landing page — https://jenovatech1.github.io/klippod-site/

## Downloads
- Android: https://play.google.com/store/apps/details?id=com.jenovatech.klippod
- Windows: https://lynk.id/jenovatech/g54elo0m0m8j

## Showcase videos (owner only)

GitHub jelek buat file besar. Prefer URL eksternal di `assets/js/clips-data.js`.

### Opsi A — Google Drive (gampang, kadang goyang)
1. Upload `.mp4` ke Drive
2. Share → **Anyone with the link**
3. Copy file id dari URL:
   `https://drive.google.com/file/d/FILE_ID/view?...`
4. Di `clips-data.js` isi:
   `drive: "FILE_ID"`
5. Commit + push (hanya JS kecil, bukan video)

### Opsi B — URL .mp4 langsung (paling stabil)
Firebase Storage / Cloudflare R2 / Bunny / S3:
`src: "https://cdn.example.com/gamer-split.mp4"`
(kosongkan `drive: ""`)

### Opsi C — file kecil di repo
`assets/clips/*.mp4` hanya kalau benar-benar ringan.
