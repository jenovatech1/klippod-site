/* Klippod site */
document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();
  if (window.AOS) AOS.init({ duration: 800, once: true });
});

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

/**
 * Try Drive stream URLs in a real <video> (object-fit + muted autoplay).
 * If all fail → Drive preview iframe (manual play, less perfect fit).
 */
function setupClipMedia(slide, clip, { isActive, onMode }) {
  const screen = slide.querySelector(".phone-screen");
  const fallback = slide.querySelector(".phone-fallback");
  const driveId = (clip.drive || "").trim();
  const directSrc = (clip.src || "").trim();

  let video = null;
  let iframe = null;
  let mode = "none"; // video | iframe

  const hideFallback = () => fallback?.classList.add("is-hidden");
  const showFallback = () => fallback?.classList.remove("is-hidden");

  const ensureVideo = () => {
    if (video) return video;
    if (iframe) {
      iframe.remove();
      iframe = null;
    }
    video = document.createElement("video");
    video.className = "phone-video";
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "auto";
    screen.insertBefore(video, fallback);
    return video;
  };

  const ensureIframe = () => {
    if (iframe) return iframe;
    if (video) {
      video.remove();
      video = null;
    }
    iframe = document.createElement("iframe");
    iframe.className = "phone-drive";
    iframe.title = clip.title || "Clip";
    iframe.allow = "autoplay; encrypted-media; picture-in-picture";
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("loading", "eager");
    screen.insertBefore(iframe, fallback);
    return iframe;
  };

  const tryVideoUrls = (urls) =>
    new Promise((resolve) => {
      if (!urls.length) {
        resolve(false);
        return;
      }
      const v = ensureVideo();
      let i = 0;

      const fail = () => {
        i += 1;
        if (i >= urls.length) {
          resolve(false);
          return;
        }
        v.src = urls[i];
        v.load();
      };

      const ok = () => {
        v.classList.add("is-ready");
        hideFallback();
        mode = "video";
        onMode?.("video");
        resolve(true);
      };

      v.onloadeddata = ok;
      v.oncanplay = ok;
      v.onerror = fail;
      v.src = urls[0];
      v.load();
    });

  const useIframe = () => {
    const frame = ensureIframe();
    mode = "iframe";
    onMode?.("iframe");
    // only set src when active — handled by sync()
    return frame;
  };

  const init = async () => {
    showFallback();
    if (directSrc) {
      const ok = await tryVideoUrls([directSrc]);
      if (ok) return;
    }
    if (driveId) {
      const candidates = window.klippodDriveStreamCandidates?.(driveId) || [];
      const ok = await tryVideoUrls(candidates);
      if (ok) return;
      useIframe();
      hideFallback();
      return;
    }
    showFallback();
  };

  const sync = async (active) => {
    if (mode === "none") await init();

    if (mode === "video" && video) {
      if (active) {
        video.muted = true;
        try {
          video.currentTime = 0;
        } catch (_) {}
        const p = video.play();
        if (p) p.catch(() => {});
      } else {
        video.pause();
        try {
          video.currentTime = 0;
        } catch (_) {}
      }
      return;
    }

    if (mode === "iframe" && iframe && driveId) {
      const preview = window.klippodDrivePreview(driveId);
      if (active) {
        // Bust cache + nudge autoplay where Drive allows it
        iframe.src = `${preview}?t=${Date.now()}`;
        iframe.classList.add("is-ready");
        hideFallback();
      } else {
        iframe.removeAttribute("src");
        iframe.classList.remove("is-ready");
      }
    }
  };

  return { init, sync, getMode: () => mode };
}

/* Showcase */
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
    .map(
      (c, i) => `
    <article class="clip-slide${i === 0 ? " is-active" : ""}" data-id="${c.id}" data-title="${c.title}" data-desc="${c.desc}">
      <div class="phone">
        <div class="phone-bezel">
          <div class="phone-notch"></div>
          <div class="phone-screen">
            <div class="phone-fallback">
              <img src="assets/images/logo.png" alt="" class="fallback-logo" />
              <span>${c.title}</span>
            </div>
            <button type="button" class="phone-play" aria-label="Play clip" hidden>
              <i class="bi bi-play-fill"></i>
            </button>
          </div>
        </div>
      </div>
    </article>`
    )
    .join("");

  const slides = Array.from(track.querySelectorAll(".clip-slide"));
  const controllers = slides.map((slide, i) => {
    const ctrl = setupClipMedia(slide, clips[i], {
      onMode: (mode) => {
        const playBtn = slide.querySelector(".phone-play");
        // Play tip only for iframe mode (Drive preview rarely autoplays)
        if (playBtn) playBtn.hidden = mode !== "iframe";
      },
    });
    const playBtn = slide.querySelector(".phone-play");
    playBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      // Re-load preview; user gesture helps Drive start
      ctrl.sync(true);
    });
    return ctrl;
  });

  let index = 0;
  let timer = null;
  let touching = false;
  let startX = 0;

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

  const apply = async () => {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    slides.forEach((s, i) => s.classList.toggle("is-active", i === index));
    track.style.transform = `translateX(-${index * 100}%)`;

    const active = slides[index];
    if (titleEl) titleEl.textContent = active.dataset.title || "";
    if (descEl) descEl.textContent = active.dataset.desc || "";
    renderDots();

    await Promise.all(controllers.map((c, i) => c.sync(i === index)));
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
    timer = setInterval(() => {
      if (!touching && !document.hidden) next(false);
    }, 12000);
  };

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
    if (document.hidden) controllers.forEach((c) => c.sync(false));
    else apply();
  });

  // Warm up first clip ASAP
  Promise.all(controllers.map((c) => c.init())).then(() => {
    apply();
    restart();
  });
});
