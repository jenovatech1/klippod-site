/**
 * Showcase clips — hosted on GitHub Releases (clean <video> autoplay).
 * https://github.com/jenovatech1/klippod-site/releases/tag/clips-v1
 */
window.KLIPPOD_CLIPS = [
  {
    id: "title-tts",
    title: "Title Card + TTS",
    desc: "Cold open dengan title card bold dan voiceover TTS.",
    src: "https://github.com/jenovatech1/klippod-site/releases/download/clips-v1/title-tts.mp4",
  },
  {
    id: "dual-split",
    title: "Dual Split",
    desc: "Dua sumber video — cocok untuk podcast, reaksi, atau commentary.",
    src: "https://github.com/jenovatech1/klippod-site/releases/download/clips-v1/dual-split.mp4",
  },
  {
    id: "auto-focus",
    title: "Auto Focus",
    desc: "Kamera mengikuti wajah dan momen penting secara otomatis.",
    src: "https://github.com/jenovatech1/klippod-site/releases/download/clips-v1/auto-focus.mp4",
  },
];

window.klippodClipSrc = function (clip) {
  return clip.src || "";
};
