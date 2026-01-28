document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Script loaded");

  // === Mobile hamburger toggle ===
  const navToggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector(".mobile-nav");

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", () => {
      mobileNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", mobileNav.classList.contains("open"));
    });
  }

  // === Lightbox (ONLY if it exists on the page) ===
  const lightbox = document.querySelector(".lightbox");

  // If no lightbox on this page, stop here (prevents errors)
  if (!lightbox) return;

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
  };

  // Close on backdrop or X
  lightbox.addEventListener("click", (e) => {
    if (e.target.dataset.close === "true" || e.target === lightbox) {
      closeLightbox();
    }
  });

  // Close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
});
