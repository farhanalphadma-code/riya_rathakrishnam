/**
 * ============================================================
 * RIYA RATHNAKARAN — PORTFOLIO JAVASCRIPT
 * Animation Logic:
 *  1. Loader           – fades out after 1.8s
 *  2. Custom cursor    – tracks mouse with lag via requestAnimationFrame
 *  3. Scroll progress  – updates width% on scroll
 *  4. Navbar           – adds 'scrolled' class after 60px
 *  5. Reveal on scroll – IntersectionObserver adds 'visible' class
 *  6. Skill bars       – animated via IntersectionObserver + CSS transitions
 *  7. Mobile nav       – toggle open/close
 *  8. Smooth scroll    – anchor links
 *  9. Back to top      – shows after 400px
 * 10. Contact form     – validation + success feedback
 * ============================================================
 */

(function () {
  "use strict";

  /* ──────────────────────────────────────────────
     1. LOADER
  ────────────────────────────────────────────── */
  const loader = document.getElementById("loader");

  function hideLoader() {
    loader.classList.add("hidden");
    // Remove from DOM after transition
    loader.addEventListener("transitionend", () => loader.remove(), { once: true });
  }

  // Minimum 1.8s for branding, then hide once DOM ready
  const loaderTimer = setTimeout(hideLoader, 1800);

  window.addEventListener("load", () => {
    clearTimeout(loaderTimer);
    setTimeout(hideLoader, 600); // small delay after full load
  });

  /* ──────────────────────────────────────────────
     2. CUSTOM CURSOR
  ────────────────────────────────────────────── */
  const cursor = document.getElementById("cursor");
  const cursorFollower = document.getElementById("cursor-follower");

  // Only enable on non-touch devices
  if (window.matchMedia("(hover: hover)").matches && cursor) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    const FOLLOW_SPEED = 0.12;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + "px";
      cursor.style.top  = mouseY + "px";
    });

    // Smooth follower via rAF
    function animateFollower() {
      followerX += (mouseX - followerX) * FOLLOW_SPEED;
      followerY += (mouseY - followerY) * FOLLOW_SPEED;
      cursorFollower.style.left = followerX + "px";
      cursorFollower.style.top  = followerY + "px";
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover states
    const hoverTargets = "a, button, .pillar-card, .timeline-card, .module-card, .exp-card, .soft-skill-chip";
    document.querySelectorAll(hoverTargets).forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.classList.add("cursor-hover");
        cursorFollower.classList.add("cursor-hover");
      });
      el.addEventListener("mouseleave", () => {
        cursor.classList.remove("cursor-hover");
        cursorFollower.classList.remove("cursor-hover");
      });
    });

    // Hide cursor when leaving window
    document.addEventListener("mouseleave", () => {
      cursor.style.opacity = "0";
      cursorFollower.style.opacity = "0";
    });
    document.addEventListener("mouseenter", () => {
      cursor.style.opacity = "1";
      cursorFollower.style.opacity = "0.6";
    });
  }

  /* ──────────────────────────────────────────────
     3. SCROLL PROGRESS BAR
  ────────────────────────────────────────────── */
  const progressBar = document.getElementById("scroll-progress");

  function updateProgress() {
    const scrollTop    = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct          = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = pct + "%";
  }

  /* ──────────────────────────────────────────────
     4. NAVBAR — scrolled state + active link
  ────────────────────────────────────────────── */
  const navbar  = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  function updateNavbar() {
    const scrollY = window.scrollY;

    // Scrolled style
    if (scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Active link highlight
    let currentSection = "";
    sections.forEach((sec) => {
      if (scrollY >= sec.offsetTop - 120) {
        currentSection = sec.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + currentSection) {
        link.classList.add("active");
      }
    });
  }

  /* ──────────────────────────────────────────────
     5. REVEAL ON SCROLL — IntersectionObserver
  ────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          // Unobserve after first reveal for performance
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -60px 0px",
    }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ──────────────────────────────────────────────
     6. SKILL BARS ANIMATION
  ────────────────────────────────────────────── */
  const skillItems = document.querySelectorAll(".skill-bar-item");
  let skillsAnimated = false;

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !skillsAnimated) {
          skillsAnimated = true;
          skillItems.forEach((item, idx) => {
            const level = item.getAttribute("data-level") || "0";
            const fill  = item.querySelector(".skill-fill");
            // Stagger each bar's animation
            setTimeout(() => {
              fill.style.width = level + "%";
            }, idx * 150 + 300);
          });
          skillObserver.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  const skillsSection = document.getElementById("skills");
  if (skillsSection) skillObserver.observe(skillsSection);

  /* ──────────────────────────────────────────────
     7. MOBILE NAV TOGGLE
  ────────────────────────────────────────────── */
  const navToggle  = document.getElementById("navToggle");
  const navLinksEl = document.getElementById("navLinks");

  // Overlay for closing nav
  const navOverlay = document.createElement("div");
  navOverlay.style.cssText = `
    position:fixed; inset:0; background:rgba(0,0,0,.45);
    z-index:799; opacity:0; pointer-events:none;
    transition:opacity .3s; backdrop-filter:blur(2px);
  `;
  document.body.appendChild(navOverlay);

  function openNav() {
    navLinksEl.classList.add("open");
    navToggle.classList.add("active");
    navToggle.setAttribute("aria-expanded", "true");
    navOverlay.style.opacity  = "1";
    navOverlay.style.pointerEvents = "auto";
    document.body.style.overflow = "hidden";
  }

  function closeNav() {
    navLinksEl.classList.remove("open");
    navToggle.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
    navOverlay.style.opacity  = "0";
    navOverlay.style.pointerEvents = "none";
    document.body.style.overflow = "";
  }

  navToggle.addEventListener("click", () => {
    navLinksEl.classList.contains("open") ? closeNav() : openNav();
  });

  navOverlay.addEventListener("click", closeNav);

  // Close nav on link click
  navLinksEl.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  /* ──────────────────────────────────────────────
     8. SMOOTH SCROLL — anchor links
  ────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const navHeight = navbar.offsetHeight;
      const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 20;

      window.scrollTo({ top: targetPos, behavior: "smooth" });
    });
  });

  /* ──────────────────────────────────────────────
     9. BACK TO TOP BUTTON
  ────────────────────────────────────────────── */
  const backToTop = document.getElementById("backToTop");

  function toggleBackToTop() {
    if (window.scrollY > 400) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  }

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ──────────────────────────────────────────────
     10. CONTACT FORM
  ────────────────────────────────────────────── */
  const contactForm = document.getElementById("contactForm");
  const formMsg     = document.getElementById("formMsg");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      formMsg.className = "form-msg";
      formMsg.textContent = "";

      // Basic validation
      const fname   = contactForm.fname.value.trim();
      const lname   = contactForm.lname.value.trim();
      const email   = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();

      if (!fname || !lname) {
        showFormMsg("Please enter your full name.", "error");
        return;
      }

      if (!email || !isValidEmail(email)) {
        showFormMsg("Please enter a valid email address.", "error");
        return;
      }

      if (!message || message.length < 10) {
        showFormMsg("Please write a message (at least 10 characters).", "error");
        return;
      }

      // Simulate submission (frontend only)
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.textContent = "Sending…";
      submitBtn.disabled = true;

      setTimeout(() => {
        showFormMsg("Thank you! Your message has been sent. Riya will be in touch soon.", "success");
        contactForm.reset();
        submitBtn.innerHTML = 'Send Message <span class="btn-arrow">→</span>';
        submitBtn.disabled = false;
      }, 1600);
    });
  }

  function showFormMsg(msg, type) {
    formMsg.textContent = msg;
    formMsg.className   = "form-msg " + type;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ──────────────────────────────────────────────
     SCROLL EVENT — throttled for performance
  ────────────────────────────────────────────── */
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        updateNavbar();
        toggleBackToTop();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  // Initial call
  updateNavbar();
  toggleBackToTop();

  /* ──────────────────────────────────────────────
     PARALLAX — subtle hero parallax on scroll
  ────────────────────────────────────────────── */
  const heroShapes = document.querySelectorAll(".float-shape");

  function parallaxHero() {
    const scrollY = window.scrollY;
    if (scrollY > window.innerHeight) return; // Only run while hero visible

    heroShapes.forEach((shape, i) => {
      const speed = 0.03 + i * 0.012;
      shape.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }

  window.addEventListener("scroll", parallaxHero, { passive: true });

  /* ──────────────────────────────────────────────
     HERO CONTENT — stagger animations on entry
     (handled by CSS animation-delay, but we ensure
     classes are activated after loader hides)
  ────────────────────────────────────────────── */
  const heroItems = document.querySelectorAll(".hero-content .reveal-up");
  setTimeout(() => {
    heroItems.forEach((el) => el.classList.add("visible"));
  }, 1900); // After loader

  /* ──────────────────────────────────────────────
     RESIZE — re-check mobile nav
  ────────────────────────────────────────────── */
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeNav();
    }
  });

  /* ──────────────────────────────────────────────
     ACTIVE NAV LINK — underline via CSS
  ────────────────────────────────────────────── */
  const style = document.createElement("style");
  style.textContent = `
    .nav-link.active:not(.nav-cta) {
      color: var(--teal) !important;
      background: var(--teal-glass) !important;
    }
    #navbar:not(.scrolled) .nav-link.active:not(.nav-cta) {
      color: var(--white) !important;
      background: rgba(255,255,255,.15) !important;
    }
  `;
  document.head.appendChild(style);

  console.log(
    "%c✦ Riya Rathnakaran Portfolio",
    "background:#0d9488;color:#fff;padding:6px 14px;border-radius:4px;font-weight:600;"
  );

})();
