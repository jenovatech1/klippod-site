/**
 * Showcase — Drive file id (share: Anyone with the link).
 * drive: "FILE_ID"  OR  src: "https://...mp4"
 */
window.KLIPPOD_CLIPS = [
  {
    id: "title-tts",
    title: "Title Card + TTS",
    desc: "Cold open dengan title card bold dan voiceover TTS.",
    drive: "1hxR_HF-N9ikKUa5dC0rImQ2Jhczrq0JL",
  },
  {
    id: "dual-split",
    title: "Dual Split",
    desc: "Dua sumber video — cocok untuk podcast, reaksi, atau commentary.",
    drive: "1usXqEUV2Cryx8Dyv6GphUvT8XfLU7L2A",
  },
  {
    id: "auto-focus",
    title: "Auto Focus",
    desc: "Kamera mengikuti wajah dan momen penting secara otomatis.",
    drive: "19o8Ph3qov6FhLZNg7Md5JslFUP8mYfsh",
  },
];

window.klippodClipSrc = function (clip) {
  const id = (clip.drive || "").trim();
  if (id) {
    // confirm=t helps skip the Drive virus-scan interstitial on many files
    return `https://drive.google.com/uc?export=download&confirm=t&id=${encodeURIComponent(id)}`;
  }
  return clip.src || "";
};
