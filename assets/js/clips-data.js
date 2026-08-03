/**
 * Showcase clips — src boleh path lokal ATAU URL penuh (CDN / Drive).
 *
 * Google Drive (share: Anyone with the link):
 *   drive: "1AbC..."          → auto diubah ke stream URL
 *   atau src: "https://..."   → dipakai langsung
 *
 * Catatan: Drive sering goyang untuk <video>. Kalau gagal, pakai Firebase Storage /
 * Cloudflare R2 / Bunny — URL .mp4 langsung paling stabil.
 */
window.KLIPPOD_CLIPS = [
  {
    id: "gamer-split",
    title: "Gamer Split",
    desc: "Gameplay penuh dengan facecam zoom — layout klasik untuk konten game.",
    drive: "", // paste Google Drive file id di sini
    src: "assets/clips/gamer-split.mp4",
  },
  {
    id: "title-tts",
    title: "Title Card + TTS",
    desc: "Cold open dengan title card bold dan voiceover TTS.",
    drive: "",
    src: "assets/clips/title-tts.mp4",
  },
  {
    id: "auto-focus",
    title: "Auto Focus",
    desc: "Kamera mengikuti wajah dan momen penting secara otomatis.",
    drive: "",
    src: "assets/clips/auto-focus.mp4",
  },
  {
    id: "dual-split",
    title: "Dual Split",
    desc: "Dua sumber video — cocok untuk podcast, reaksi, atau commentary.",
    drive: "",
    src: "assets/clips/dual-split.mp4",
  },
  {
    id: "podcast-side",
    title: "Podcast Side",
    desc: "Wajah kanan, shadow + Side Glow di kiri — template storytelling.",
    drive: "",
    src: "assets/clips/podcast-side.mp4",
  },
  {
    id: "opus-beat",
    title: "Opus Beat",
    desc: "Caption story-led dengan beat highlight yang premium.",
    drive: "",
    src: "assets/clips/opus-beat.mp4",
  },
  {
    id: "karaoke-sweep",
    title: "Karaoke Sweep",
    desc: "Highlight kata berjalan mengikuti audio — klasik short-form.",
    drive: "",
    src: "assets/clips/karaoke-sweep.mp4",
  },
  {
    id: "punch-word",
    title: "Punch Word",
    desc: "Satu kata aktif dipunch keras, sisanya tetap soft.",
    drive: "",
    src: "assets/clips/punch-word.mp4",
  },
  {
    id: "border-pop",
    title: "Border Pop",
    desc: "Keyword dengan neon box — stop-scroll caption.",
    drive: "",
    src: "assets/clips/border-pop.mp4",
  },
  {
    id: "dual-tone",
    title: "Dual Tone",
    desc: "Soft glow putih, satu baris — look clean dan modern.",
    drive: "",
    src: "assets/clips/dual-tone.mp4",
  },
  {
    id: "fill-flash",
    title: "Fill Flash",
    desc: "Flash fill agresif di kata aktif untuk energi tinggi.",
    drive: "",
    src: "assets/clips/fill-flash.mp4",
  },
  {
    id: "side-glow",
    title: "Side Glow",
    desc: "Subtitle kiri reveal-stay — pasangan Podcast Side.",
    drive: "",
    src: "assets/clips/side-glow.mp4",
  },
];

window.klippodClipSrc = function (clip) {
  const id = (clip.drive || "").trim();
  if (id) {
    // Direct-ish stream. File harus "Anyone with the link".
    return `https://drive.google.com/uc?export=download&id=${encodeURIComponent(id)}`;
  }
  return clip.src || "";
};
