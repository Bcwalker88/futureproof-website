document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Script loaded");

  // === Mobile hamburger toggle ===
  const navToggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector(".mobile-nav");

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", () => {
      mobileNav.classList.toggle("open");
    });
  }

  // (You can add your other JS below if you want later)
});


// Close on backdrop or X
lightbox.addEventListener('click', (e) => {
  if (e.target.dataset.close === 'true') {
    closeLightbox();
  }
});

// Close on ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
    closeLightbox();
  }
});
