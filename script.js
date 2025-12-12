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
