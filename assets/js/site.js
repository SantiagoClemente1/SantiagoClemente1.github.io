/*
  Shared header + footer for every page.
  Edit the nav or contact links HERE and every page updates.

  Each page's <body> sets:
    data-page="home|about|projects|research|resume"  -> highlights the current tab
    data-root=""  (top-level pages) or data-root="../" (pages inside /projects or /research)
*/
(function () {
  var CONTACT = {
    email: "santi.clemente123@gmail.com",
    linkedin: "https://www.linkedin.com/in/santiago-clemente-a61904340/"
  };

  var LINKS = [
    ["home", "index.html", "Home"],
    ["about", "about.html", "About Me"],
    ["projects", "projects.html", "Projects"],
    ["research", "research.html", "Research"],
    ["resume", "resume.html", "Resume"]
  ];

  var body = document.body;
  var root = body.getAttribute("data-root") || "";
  var page = body.getAttribute("data-page") || "";

  // ---- Header ----
  var header = document.getElementById("site-header");
  if (header) {
    var items = LINKS.map(function (l) {
      var current = l[0] === page ? ' aria-current="page"' : "";
      return '<li><a href="' + root + l[1] + '"' + current + ">" + l[2] + "</a></li>";
    }).join("");

    header.className = "site-header";
    header.innerHTML =
      '<nav aria-label="Main"><ul class="nav-links">' + items + "</ul></nav>";
  }

  // ---- Light / dark toggle (choice is remembered on this device) ----
  var toggleBtn = document.createElement("button");
  toggleBtn.type = "button";
  toggleBtn.className = "theme-toggle";
  toggleBtn.setAttribute("aria-label", "Switch between light and dark mode");
  toggleBtn.innerHTML =
    '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>' +
    '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  document.body.appendChild(toggleBtn);
  toggleBtn.addEventListener("click", function () {
    var html = document.documentElement;
    var current = html.getAttribute("data-theme") ||
      (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var next = current === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  // ---- Click any figure (.fig-frame) to view it full size ----
  var frames = document.querySelectorAll(".fig-frame img");
  if (frames.length) {
    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-label", "Enlarged figure");
    box.innerHTML = '<img alt="">';
    document.body.appendChild(box);
    var big = box.querySelector("img");
    var close = function () { box.classList.remove("open"); };
    box.addEventListener("click", close);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    frames.forEach(function (img) {
      img.parentNode.addEventListener("click", function () {
        big.src = img.src; big.alt = img.alt;
        box.classList.add("open");
      });
    });
  }

  // ---- Footer ----
  var footer = document.getElementById("site-footer");
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML =
      '<div class="container">' +
        "<span>&copy; " + new Date().getFullYear() + " Santiago Clemente</span>" +
        "<nav>" +
          '<a href="mailto:' + CONTACT.email + '">Email</a>' +
          '<a href="' + CONTACT.linkedin + '" target="_blank" rel="noopener">LinkedIn</a>' +
          '<a href="' + root + 'resume.html">Resume</a>' +
        "</nav>" +
      "</div>";
  }
})();

// Copy-to-clipboard buttons (e.g. the email pill on the home page)
document.querySelectorAll(".copy-btn[data-copy]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    var label = btn.querySelector(".copy-text");
    var done = function () {
      btn.classList.add("copied"); if (label) label.textContent = "Copied";
      setTimeout(function () { btn.classList.remove("copied"); if (label) label.textContent = "Copy"; }, 1600);
    };
    var text = btn.getAttribute("data-copy");
    var fallback = function () {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      var ok = false; try { ok = document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta);
      if (ok) done();
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
  });
});

// Cursor glow inside the Get in touch section (mouse only)
(function () {
  var section = document.querySelector(".contact");
  if (!section || !window.matchMedia || !window.matchMedia("(hover: hover)").matches) return;
  section.addEventListener("pointermove", function (e) {
    var r = section.getBoundingClientRect();
    section.style.setProperty("--mx", (e.clientX - r.left) + "px");
    section.style.setProperty("--my", (e.clientY - r.top) + "px");
    section.classList.add("glow-on");
    var overContent = e.target !== section && e.target.closest &&
      e.target.closest("h2, p, .eyebrow, .explore-tile, .email-pill, a, button");
    section.classList.toggle("glow-small", !!overContent);
  });
  section.addEventListener("pointerleave", function () { section.classList.remove("glow-on", "glow-small"); });
})();

// Fade/slide story rows in as they scroll into view
(function () {
  var rows = document.querySelectorAll(".story-row");
  if (!rows.length || !("IntersectionObserver" in window)) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  rows.forEach(function (r) { r.classList.add("reveal"); io.observe(r); });
})();

// Experience carousel: looping arrows + dots
document.querySelectorAll(".carousel").forEach(function (car) {
  var track = car.querySelector(".car-track");
  var cards = Array.prototype.slice.call(track.children);
  var dotsWrap = car.querySelector(".car-dots");
  var current = 0;
  var dots = cards.map(function (card, i) {
    var d = document.createElement("button");
    d.type = "button"; d.className = "car-dot"; d.setAttribute("role", "tab");
    var title = card.querySelector("h3");
    d.setAttribute("aria-label", "Show " + (title ? title.textContent : "item " + (i + 1)));
    d.addEventListener("click", function () { goTo(i); });
    dotsWrap.appendChild(d);
    return d;
  });
  var busy = false, busyT;
  // Side padding = half the leftover space, so the first and last cards can sit centered too
  function sizePadding() {
    var cw = track.clientWidth;
    var w = Math.round(cw * (cw < 480 ? 0.88 : 0.82));
    cards.forEach(function (c) { c.style.flex = "0 0 " + w + "px"; });
    var pad = Math.max(0, (cw - w) / 2);
    track.style.paddingLeft = pad + "px"; track.style.paddingRight = pad + "px";
  }
  function targetLeft(i) {
    var c = cards[i];
    return c.offsetLeft - (track.clientWidth - c.offsetWidth) / 2;
  }
  function setActive(i) {
    current = i;
    cards.forEach(function (c, k) { c.classList.toggle("is-active", k === i); });
    dots.forEach(function (d, k) { d.classList.toggle("is-active", k === i); d.setAttribute("aria-selected", k === i ? "true" : "false"); });
  }
  function goTo(i) {
    i = (i + cards.length) % cards.length;           // wrap around: last -> first, first -> last
    busy = true; clearTimeout(busyT); busyT = setTimeout(function () { busy = false; }, 1500);
    var left = targetLeft(i), start = track.scrollLeft;
    track.scrollTo({ left: left, behavior: "smooth" });
    setTimeout(function () { if (Math.abs(track.scrollLeft - start) < 2 && Math.abs(left - start) > 2) track.scrollTo({ left: left, behavior: "auto" }); }, 250);
    setActive(i);
  }
  car.querySelector(".car-prev").addEventListener("click", function () { goTo(current - 1); });
  car.querySelector(".car-next").addEventListener("click", function () { goTo(current + 1); });
  track.addEventListener("scrollend", function () { busy = false; clearTimeout(busyT); });
  // Keep the active card in sync when someone swipes or scrolls by hand
  var t;
  track.addEventListener("scroll", function () {
    if (busy) return;
    clearTimeout(t);
    t = setTimeout(function () {
      if (busy) return;
      var mid = track.scrollLeft + track.clientWidth / 2, best = 0, bestD = Infinity;
      cards.forEach(function (c, k) { var d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (d < bestD) { bestD = d; best = k; } });
      setActive(best);
    }, 80);
  }, { passive: true });
  var details = car.closest("details");
  if (details) details.addEventListener("toggle", function () { if (details.open) { sizePadding(); track.scrollTo({ left: targetLeft(current), behavior: "auto" }); } });
  window.addEventListener("resize", function () { sizePadding(); track.scrollTo({ left: targetLeft(current), behavior: "auto" }); });
  sizePadding();
  setActive(0);
});


// 3D tilt: story images lean toward the mouse (mouse/trackpad only)
(function () {
  if (!window.matchMedia || !window.matchMedia("(hover: hover)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var MAX = 10; // degrees
  document.querySelectorAll(".story-media > img, .story-media > .story-art").forEach(function (el) {
    var wrap = document.createElement("div"); wrap.className = "tilt";
    var inner = document.createElement("div"); inner.className = "tilt-inner";
    el.parentNode.insertBefore(wrap, el); wrap.appendChild(inner); inner.appendChild(el);
    wrap.addEventListener("pointermove", function (e) {
      var r = wrap.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      inner.style.setProperty("--ry", ((x - 0.5) * 2 * MAX).toFixed(2) + "deg");
      inner.style.setProperty("--rx", ((0.5 - y) * 2 * MAX).toFixed(2) + "deg");
      inner.style.setProperty("--gx", (x * 100).toFixed(1) + "%");
      inner.style.setProperty("--gy", (y * 100).toFixed(1) + "%");
      wrap.classList.add("is-tilting");
    });
    wrap.addEventListener("pointerleave", function () {
      wrap.classList.remove("is-tilting");
      inner.style.setProperty("--rx", "0deg"); inner.style.setProperty("--ry", "0deg");
    });
  });
})();

// In-page links (e.g. About Me jump tiles): smooth scroll, with an instant fallback
document.querySelectorAll('a[href^="#"]').forEach(function (a) {
  var id = a.getAttribute("href").slice(1);
  if (!id) return;
  a.addEventListener("click", function (e) {
    var target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    // If smooth scrolling stalls or isn't supported, make sure we still arrive
    setTimeout(function () {
      if (Math.abs(target.getBoundingClientRect().top - 70) > 40) target.scrollIntoView({ behavior: "auto", block: "start" });
    }, 900);
    if (history.replaceState) history.replaceState(null, "", "#" + id);
  });
});
