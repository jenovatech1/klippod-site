/* Klippod site */
document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();
  if (window.AOS) AOS.init({ duration: 800, once: true });
});

/* Particles — SeedSafe vibe */
document.addEventListener("DOMContentLoaded", () => {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (!location.hash) {
    const root = document.documentElement;
    const prev = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      root.style.scrollBehavior = prev || "";
    });
  }
  if (!window.particlesJS) return;
  particlesJS("particles-js", {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: "#39b54a" },
      shape: { type: "circle" },
      opacity: { value: 0.5, random: false },
      size: { value: 3, random: true },
      line_linked: { enable: true, distance: 150, color: "#39b54a", opacity: 0.2, width: 1 },
      move: { enable: true, speed: 2, direction: "none", random: false, straight: false, out_mode: "out", bounce: false },
    },
    interactivity: {
      detect_on: "canvas",
      events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" }, resize: true },
      modes: { grab: { distance: 140, line_linked: { opacity: 0.5 } }, push: { particles_nb: 4 } },
    },
    retina_detect: true,
  });
});

/* Navbar */
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("nav.navbar");
  const navbarCollapse = document.getElementById("navbarNav");
  if (!nav || !navbarCollapse) return;
  const updateNavBg = () => {
    if (window.scrollY > 8) nav.classList.add("is-scrolled");
    else if (!navbarCollapse.classList.contains("show")) nav.classList.remove("is-scrolled");
  };
  navbarCollapse.addEventListener("shown.bs.collapse", () => nav.classList.add("is-scrolled"));
  navbarCollapse.addEventListener("hidden.bs.collapse", updateNavBg);
  window.addEventListener("scroll", updateNavBg, { passive: true });
  updateNavBg();
});

/* Smooth scroll */
document.addEventListener("DOMContentLoaded", () => {
  const navbarCollapse = document.getElementById("navbarNav");
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--anchor-offset"), 10) || 80;
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
      if (navbarCollapse?.classList.contains("show")) {
        bootstrap.Collapse.getInstance(navbarCollapse)?.hide();
      }
    });
  });
});

function posterFor(src) {
  if (!src) return "";
  return src.replace(/\.mp4($|\?)/i, ".jpg$1");
}

function bindPhoneVideo(video, fallback, src, { muted = true, autoplay = true } = {}) {
  if (!video || !src) return;
  const onReady = () => {
    video.classList.add("is-ready");
    fallback?.classList.add("is-hidden");
    if (autoplay) video.play().catch(() => {});
  };
  const onFail = () => {
    video.classList.remove("is-ready");
    fallback?.classList.remove("is-hidden");
    video.removeAttribute("src");
    video.load();
  };

  video.muted = muted;
  video.playsInline = true;
  video.loop = true;
  video.preload = "metadata";
  video.setAttribute("playsinline", "");
  video.poster = posterFor(src);

  video.onloadeddata = onReady;
  video.oncanplay = onReady;
  video.onerror = onFail;
  video.src = src;
  video.load();
}

/* Hero phone uses first available clip */
document.addEventListener("DOMContentLoaded", () => {
  const clips = window.KLIPPOD_CLIPS || [];
  const video = document.getElementById("heroVideo");
  const fallback = document.getElementById("heroFallback");
  const muteBtn = document.getElementById("heroMute");
  if (!video || !clips.length) return;

  const first = clips[0];
  bindPhoneVideo(video, fallback, first.src, { muted: true, autoplay: true });

  const revealMute = () => {
    if (video.classList.contains("is-ready") && muteBtn) muteBtn.hidden = false;
  };
  video.addEventListener("loadeddata", revealMute);

  muteBtn?.addEventListener("click", () => {
    video.muted = !video.muted;
    muteBtn.innerHTML = video.muted
      ? '<i class="bi bi-volume-mute-fill"></i>'
      : '<i class="bi bi-volume-up-fill"></i>';
    video.play().catch(() => {});
  });
});

/* Showcase carousel with video-in-phone */
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("showcaseTrack");
  const clips = window.KLIPPOD_CLIPS || [];
  if (!track || !clips.length) return;

  const titleEl = document.getElementById("slideTitle");
  const descEl = document.getElementById("slideDesc");
  const dotsEl = document.getElementById("slideDots");
  const thumbsEl = document.getElementById("thumbRail");
  const prevBtn = document.querySelector(".nav-arrow.prev");
  const nextBtn = document.querySelector(".nav-arrow.next");
  const filters = Array.from(document.querySelectorAll(".filter-chip"));

  const icons = {
    tts: "bi-mic",
    subs: "bi-chat-quote",
    cut: "bi-scissors",
    layout: "bi-layout-split",
  };

  // Build slides once
  track.innerHTML = clips
    .map(
      (c, i) => `
    <article class="clip-slide${i === 0 ? " is-active" : ""}" data-id="${c.id}" data-tags="${c.tags}" data-title="${c.title}" data-desc="${c.desc}" data-src="${c.src}">
      <div class="phone">
        <div class="phone-bezel">
          <div class="phone-notch"></div>
          <div class="phone-screen">
            <video class="phone-video" playsinline muted loop preload="metadata"></video>
            <div class="phone-fallback">
              <img src="assets/images/logo.png" alt="" class="fallback-logo" />
              <span>Drop <code>${(c.src || "").split("/").pop()}</code></span>
            </div>
            <div class="phone-label">${c.title}</div>
            <button type="button" class="phone-mute" aria-label="Toggle sound" hidden>
              <i class="bi bi-volume-mute-fill"></i>
            </button>
          </div>
        </div>
      </div>
    </article>`
    )
    .join("");

  const slides = Array.from(track.querySelectorAll(".clip-slide"));

  // Probe / bind each video
  slides.forEach((slide) => {
    const video = slide.querySelector(".phone-video");
    const fallback = slide.querySelector(".phone-fallback");
    const muteBtn = slide.querySelector(".phone-mute");
    const src = slide.dataset.src;
    bindPhoneVideo(video, fallback, src, { muted: true, autoplay: false });

    video?.addEventListener("loadeddata", () => {
      slide.classList.add("has-video");
      if (muteBtn) muteBtn.hidden = false;
    });
    video?.addEventListener("error", () => slide.classList.remove("has-video"));

    muteBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!video) return;
      video.muted = !video.muted;
      muteBtn.innerHTML = video.muted
        ? '<i class="bi bi-volume-mute-fill"></i>'
        : '<i class="bi bi-volume-up-fill"></i>';
      video.play().catch(() => {});
    });
  });

  let filter = "all";
  let index = 0;
  let timer = null;
  let touching = false;
  let startX = 0;

  const visible = () =>
    slides
      .map((s, i) => ({ s, i }))
      .filter(({ s }) => filter === "all" || (s.dataset.tags || "").includes(filter));

  const pauseAll = () => {
    slides.forEach((s) => {
      const v = s.querySelector(".phone-video");
      if (v && !v.paused) v.pause();
    });
  };

  const playActive = () => {
    const list = visible();
    if (!list.length) return;
    const slide = list[index]?.s;
    const video = slide?.querySelector(".phone-video");
    if (!video || !slide.classList.contains("has-video")) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  const renderChrome = () => {
    const list = visible();
    dotsEl.innerHTML = "";
    thumbsEl.innerHTML = "";
    list.forEach(({ s }, localIdx) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Go to slide ${localIdx + 1}`);
      if (localIdx === index) dot.classList.add("is-active");
      dot.addEventListener("click", () => go(localIdx, true));
      dotsEl.appendChild(dot);

      const tag = (s.dataset.tags || "tts").split(/\s+/)[0];
      const thumb = document.createElement("button");
      thumb.type = "button";
      thumb.className = "thumb" + (localIdx === index ? " is-active" : "");
      thumb.innerHTML = `<i class="t-ico bi ${icons[tag] || "bi-play-circle"}"></i><span class="t-label">${s.dataset.title || "Clip"}</span>`;
      thumb.addEventListener("click", () => go(localIdx, true));
      thumbsEl.appendChild(thumb);
    });
  };

  const apply = () => {
    const list = visible();
    if (!list.length) return;
    if (index >= list.length) index = 0;
    const currentGlobal = list[index].i;

    pauseAll();

    slides.forEach((s, i) => {
      const show = list.some((x) => x.i === i);
      s.style.display = show ? "" : "none";
      s.classList.toggle("is-active", i === currentGlobal);
    });

    const shown = slides.filter((s) => s.style.display !== "none");
    const activeShownIdx = shown.findIndex((s) => s.classList.contains("is-active"));
    track.style.transform = `translateX(-${Math.max(0, activeShownIdx) * 100}%)`;

    const active = slides[currentGlobal];
    if (titleEl) titleEl.textContent = active.dataset.title || "";
    if (descEl) descEl.textContent = active.dataset.desc || "";
    renderChrome();
    playActive();
  };

  const go = (localIdx, user) => {
    const list = visible();
    if (!list.length) return;
    index = ((localIdx % list.length) + list.length) % list.length;
    apply();
    if (user) restart();
  };

  const next = (user) => go(index + 1, user);
  const prev = (user) => go(index - 1, user);

  const restart = () => {
    clearInterval(timer);
    timer = setInterval(() => {
      if (!touching && !document.hidden) next(false);
    }, 5200);
  };

  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      filters.forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-selected", b === btn ? "true" : "false");
      });
      filter = btn.dataset.filter || "all";
      index = 0;
      apply();
      restart();
    });
  });

  prevBtn?.addEventListener("click", () => prev(true));
  nextBtn?.addEventListener("click", () => next(true));

  const viewport = document.querySelector(".showcase-viewport");
  viewport?.addEventListener(
    "touchstart",
    (e) => {
      touching = true;
      startX = e.changedTouches[0].clientX;
    },
    { passive: true }
  );
  viewport?.addEventListener(
    "touchend",
    (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      touching = false;
      if (Math.abs(dx) < 40) return;
      if (dx < 0) next(true);
      else prev(true);
    },
    { passive: true }
  );

  const stage = document.querySelector(".showcase-stage");
  stage?.addEventListener("mouseenter", () => clearInterval(timer));
  stage?.addEventListener("mouseleave", restart);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pauseAll();
    else playActive();
  });

  apply();
  restart();
});
