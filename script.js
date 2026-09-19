/* Susmitha P — portfolio interactions (no dependencies) */
(function () {
  "use strict";
  var doc = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Mobile menu ---- */
  var btn = document.getElementById("menuBtn");
  var links = document.getElementById("navLinks");
  function setMenu(open) {
    if (!btn || !links) return;
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    links.classList.toggle("open", open);
  }
  if (btn && links) {
    btn.addEventListener("click", function () {
      setMenu(btn.getAttribute("aria-expanded") !== "true");
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        btn.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) setMenu(false);
    });
  }

  /* ---- Header border on scroll ---- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Reveal on scroll (one quiet entrance) ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Active link highlighting ---- */
  function watch(anchorSelector, attr) {
    var anchors = Array.prototype.slice.call(document.querySelectorAll(anchorSelector));
    if (!anchors.length || !("IntersectionObserver" in window)) return;
    var map = {};
    anchors.forEach(function (a) {
      var id = (a.getAttribute("href") || "").split("#")[1];
      if (id) map[id] = a;
    });
    var targets = Object.keys(map).map(function (id) { return document.getElementById(id); }).filter(Boolean);
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          anchors.forEach(function (a) { a.removeAttribute(attr); });
          if (map[en.target.id]) map[en.target.id].setAttribute(attr, "true");
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    targets.forEach(function (t) { so.observe(t); });
  }
  if (document.body.dataset.page === "home") watch(".nav-links a[href^='#']", "aria-current");
  watch(".cs-index a", "aria-current");

  /* ---- Playground: tabs, dock, chips (toggle pressed state) ---- */
  function group(selector) {
    document.querySelectorAll(selector).forEach(function (wrap) {
      var items = wrap.querySelectorAll("button");
      items.forEach(function (b) {
        b.addEventListener("click", function () {
          items.forEach(function (o) { o.setAttribute("aria-pressed", o === b ? "true" : "false"); });
        });
      });
    });
  }
  group("[data-group='single']");
  document.querySelectorAll("[data-toggle]").forEach(function (b) {
    b.addEventListener("click", function () {
      b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") === "true" ? "false" : "true");
    });
  });

  /* ---- Playground: live validation demo ---- */
  var demo = document.getElementById("demoEmail");
  if (demo) {
    var wrap = demo.closest(".field");
    var hint = wrap.querySelector(".hint span");
    demo.addEventListener("input", function () {
      var v = demo.value.trim();
      wrap.classList.remove("bad", "good");
      if (!v) { hint.textContent = "We'll only use this to reply."; return; }
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        wrap.classList.add("good");
        hint.textContent = "Looks good.";
      } else {
        wrap.classList.add("bad");
        hint.textContent = "Add an @ and a domain, like name@email.com.";
      }
    });
  }

  /* ---- Contact form → mailto (no backend) ---- */
  var form = document.getElementById("contactForm");
  if (form) {
    var status = document.getElementById("formStatus");
    var TO = "susmithapadmanabhan08@gmail.com";
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.elements["name"].value.trim();
      var email = form.elements["email"].value.trim();
      var message = form.elements["message"].value.trim();
      status.classList.remove("err");
      if (!name || !email || !message) {
        status.classList.add("err");
        status.textContent = "Please fill in your name, email and message.";
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        status.classList.add("err");
        status.textContent = "Please enter a valid email address.";
        form.elements["email"].focus();
        return;
      }
      var subject = "Portfolio message from " + name;
      var body = message + "\n\n— " + name + "\n" + email;
      status.textContent = "Opening your email app…";
      window.location.href = "mailto:" + TO + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }
})();
