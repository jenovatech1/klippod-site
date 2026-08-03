/**
 * Showcase — Drive file id (Anyone with the link) OR direct src mp4 URL.
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

/** Direct stream for <video> — autoplay + object-fit cover. */
window.klippodDriveStreamCandidates = function (id) {
  const enc = encodeURIComponent(id);
  return [
    `https://drive.usercontent.google.com/download?id=${enc}&export=download&confirm=t`,
  ];
};

window.klippodDrivePreview = function (id) {
  return `https://drive.google.com/file/d/${encodeURIComponent(id)}/preview`;
};
