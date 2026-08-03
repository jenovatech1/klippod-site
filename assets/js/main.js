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

function bindDirectVideo(video, fallback, src, { muted = true, autoplay = false, onReady } = {}) {
  if (!video || !src) return;
  const markReady = () => {
    video.classList.add("is-ready");
    fallback?.classList.add("is-hidden");
    onReady?.();
    if (autoplay) video.play().catch(() => {});
  };
  video.muted = muted;
  video.playsInline = true;
  video.loop = true;
  video.preload = "metadata";
  video.setAttribute("playsinline", "");
  if (!/^https?:\/\//i.test(src)) video.poster = posterFor(src);
  video.onloadeddata = markReady;
  video.oncanplay = markReady;
  video.onerror = () => {
    video.classList.remove("is-ready");
    fallback?.classList.remove("is-hidden");
  };
  video.src = src;
  video.load();
}

/* Showcase — Drive preview iframe (reliable) or direct <video> */
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("showcaseTrack");
  const clips = window.KLIPPOD_CLIPS || [];
  if (!track || !clips.length) return;

  const titleEl = document.getElementById("slideTitle");
  const descEl = document.getElementById("slideDesc");
  const dotsEl = document.getElementById("slideDots");
  const prevBtn = document.querySelector(".nav-arrow.prev");
  const nextBtn = document.querySelector(".nav-arrow.next");

  track.innerHTML = clips
    .map((c, i) => {
      const driveId = (c.drive || "").trim();
      const isDrive = Boolean(driveId);
      const src = window.klippodClipSrc(c);
      return `
    <article class="clip-slide${i === 0 ? " is-active" : ""}${isDrive ? " is-drive" : ""}"
      data-id="${c.id}"
      data-title="${c.title}"
      data-desc="${c.desc}"
      data-src="${src}"
      data-drive="${driveId}">
      <div class="phone">
        <div class="phone-bezel">
          <div class="phone-notch"></div>
          <div class="phone-screen">
            ${
              isDrive
                ? `<iframe class="phone-drive" title="${c.title}" allow="autoplay; encrypted-media" allowfullscreen loading="lazy"></iframe>`
                : `<video class="phone-video" playsinline muted loop preload="metadata"></video>`
            }
            <div class="phone-fallback">
              <img src="assets/images/logo.png" alt="" class="fallback-logo" />
              <span>${c.title}</span>
            </div>
          </div>
        </div>
      </div>
    </article>`;
    })
    .join("");

  const slides = Array.from(track.querySelectorAll(".clip-slide"));
  let index = 0;
  let timer = null;
  let touching = false;
  let startX = 0;
  const usesDrive = clips.some((c) => (c.drive || "").trim());

  const stopAll = () => {
    slides.forEach((s) => {
      const iframe = s.querySelector(".phone-drive");
      const video = s.querySelector(".phone-video");
      const fallback = s.querySelector(".phone-fallback");
      if (iframe) {
        iframe.removeAttribute("src");
        iframe.classList.remove("is-ready");
        fallback?.classList.remove("is-hidden");
      }
      if (video && !video.paused) {
        video.pause();
        try {
          video.currentTime = 0;
        } catch (_) {}
      }
    });
  };

  const playActive = () => {
    const slide = slides[index];
    if (!slide) return;
    const iframe = slide.querySelector(".phone-drive");
    const video = slide.querySelector(".phone-video");
    const fallback = slide.querySelector(".phone-fallback");
    const src = slide.dataset.src;

    if (iframe && src) {
      // Reload preview only for active slide (starts playback in Drive player)
      if (iframe.getAttribute("src") !== src) iframe.src = src;
      iframe.classList.add("is-ready");
      fallback?.classList.add("is-hidden");
      slide.classList.add("has-video");
      return;
    }

    if (video && slide.classList.contains("has-video")) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  };

  const renderDots = () => {
    if (!dotsEl) return;
    dotsEl.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      if (i === index) dot.classList.add("is-active");
      dot.addEventListener("click", () => go(i, true));
      dotsEl.appendChild(dot);
    });
  };

  const apply = () => {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    stopAll();

    slides.forEach((s, i) => {
      s.classList.toggle("is-active", i === index);
    });
    track.style.transform = `translateX(-${index * 100}%)`;

    const active = slides[index];
    if (titleEl) titleEl.textContent = active.dataset.title || "";
    if (descEl) descEl.textContent = active.dataset.desc || "";
    renderDots();
    playActive();
  };

  const go = (i, user) => {
    index = ((i % slides.length) + slides.length) % slides.length;
    apply();
    if (user) restart();
  };

  const next = (user) => go(index + 1, user);
  const prev = (user) => go(index - 1, user);

  const restart = () => {
    clearInterval(timer);
    // Drive clips are longer — slower auto-advance
    timer = setInterval(() => {
      if (!touching && !document.hidden) next(false);
    }, usesDrive ? 14000 : 5500);
  };

  slides.forEach((slide) => {
    if (slide.classList.contains("is-drive")) return;
    const video = slide.querySelector(".phone-video");
    const fallback = slide.querySelector(".phone-fallback");
    bindDirectVideo(video, fallback, slide.dataset.src, {
      muted: true,
      autoplay: false,
      onReady: () => {
        slide.classList.add("has-video");
        if (slide.classList.contains("is-active")) playActive();
      },
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
    if (document.hidden) stopAll();
    else playActive();
  });

  apply();
  restart();
});
