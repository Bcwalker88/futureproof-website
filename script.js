document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Script loaded");
  document.body.classList.add("js-ready");

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

  if (lightbox) {
    const lightboxImage = lightbox.querySelector(".lightbox-image");
    const lightboxCaption = lightbox.querySelector(".lightbox-caption");
    const lightboxTriggers = document.querySelectorAll(".starlink-page .hero-frame");
    const galleryLightboxLinks = document.querySelectorAll(".gallery-lightbox");

    const openLightbox = (src, alt, caption) => {
      if (!lightboxImage) return;
      lightboxImage.src = src;
      lightboxImage.alt = alt || "";
      if (lightboxCaption) {
        lightboxCaption.textContent = caption || "";
      }
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
    };

    const closeLightbox = () => {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
    };

    lightboxTriggers.forEach((figure) => {
      const image = figure.querySelector("img");
      const caption = figure.querySelector("figcaption");
      if (!image) return;

      const openFromFigure = () => {
        openLightbox(image.getAttribute("src"), image.getAttribute("alt"), caption ? caption.textContent : "");
      };

      figure.addEventListener("click", openFromFigure);
      figure.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openFromFigure();
        }
      });
    });

    galleryLightboxLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const image = link.querySelector("img");
        const figure = link.closest("figure");
        const caption = figure ? figure.querySelector("figcaption") : null;
        openLightbox(
          link.getAttribute("href"),
          image ? image.getAttribute("alt") : "",
          link.dataset.caption || (caption ? caption.textContent : "")
        );
      });
    });

    lightbox.addEventListener("click", (e) => {
      if (e.target.dataset.close === "true" || e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    });
  }

  // === Quote form enhancements ===
  const quoteForm = document.querySelector("#quote-form");

  if (quoteForm) {
    const serviceSelect = quoteForm.querySelector("#service");
    const chipButtons = document.querySelectorAll(".service-chip[data-service]");
    const phoneInput = quoteForm.querySelector("#phone");
    const addressInput = quoteForm.querySelector("#address");
    const submitButton = quoteForm.querySelector(".btn-quote-submit");
    const feedback = quoteForm.querySelector("#quote-feedback");
    const redirectUrl = quoteForm.dataset.redirect;

    if (redirectUrl) {
      if (!quoteForm.querySelector('input[name="_redirect"]')) {
        const redirectInput = document.createElement("input");
        redirectInput.type = "hidden";
        redirectInput.name = "_redirect";
        redirectInput.value = redirectUrl;
        quoteForm.appendChild(redirectInput);
      }

      if (!quoteForm.querySelector('input[name="_next"]')) {
        const nextInput = document.createElement("input");
        nextInput.type = "hidden";
        nextInput.name = "_next";
        nextInput.value = redirectUrl;
        quoteForm.appendChild(nextInput);
      }
    }

    const updateActiveChip = () => {
      chipButtons.forEach((chip) => {
        chip.classList.toggle("is-active", serviceSelect && chip.dataset.service === serviceSelect.value);
      });
    };

    chipButtons.forEach((chip) => {
      chip.addEventListener("click", () => {
        if (!serviceSelect) return;
        serviceSelect.value = chip.dataset.service;
        updateActiveChip();
        if (feedback) feedback.textContent = "";
      });
    });

    if (serviceSelect) {
      serviceSelect.addEventListener("change", updateActiveChip);
      updateActiveChip();
    }

    const initGoogleAddressAutocomplete = () => {
      if (!addressInput || !window.google || !window.google.maps || !window.google.maps.places) return;

      const autocomplete = new window.google.maps.places.Autocomplete(addressInput, {
        types: ["address"],
        componentRestrictions: { country: "au" },
        fields: ["formatted_address"]
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place && place.formatted_address) {
          addressInput.value = place.formatted_address;
        }
      });
    };

    if (addressInput) {
      const mapsKey = typeof window.GOOGLE_MAPS_API_KEY === "string"
        ? window.GOOGLE_MAPS_API_KEY.trim()
        : "";

      if (window.google && window.google.maps && window.google.maps.places) {
        initGoogleAddressAutocomplete();
      } else if (mapsKey && mapsKey !== "YOUR_GOOGLE_MAPS_API_KEY") {
        window.initGoogleAddressAutocomplete = initGoogleAddressAutocomplete;
        const existingMapsScript = document.querySelector('script[data-google-maps="quote"]');

        if (!existingMapsScript) {
          const mapsScript = document.createElement("script");
          mapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${mapsKey}&libraries=places&callback=initGoogleAddressAutocomplete`;
          mapsScript.async = true;
          mapsScript.defer = true;
          mapsScript.dataset.googleMaps = "quote";
          document.head.appendChild(mapsScript);
        }
      } else {
        console.warn("Google Places autocomplete is disabled: set window.GOOGLE_MAPS_API_KEY in quote.html.");
      }
    }

    const validatePhone = () => {
      if (!phoneInput) return true;
      const digits = phoneInput.value.replace(/\D/g, "");
      const isValid = digits.length >= 9 && digits.length <= 10;
      phoneInput.setCustomValidity(isValid ? "" : "Please enter a valid Australian phone number.");
      return isValid;
    };

    if (phoneInput) {
      phoneInput.addEventListener("input", () => {
        validatePhone();
        if (feedback) feedback.textContent = "";
      });
    }

    quoteForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      validatePhone();

      if (!quoteForm.checkValidity()) {
        quoteForm.reportValidity();
        if (feedback) {
          feedback.textContent = "Please check the highlighted fields and try again.";
          feedback.classList.remove("is-success");
        }
        return;
      }

      if (feedback) {
        feedback.textContent = "Submitting your quote request...";
        feedback.classList.add("is-success");
      }

      if (submitButton) {
        submitButton.classList.add("is-submitting");
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
      }

      try {
        const response = await fetch(quoteForm.action, {
          method: "POST",
          body: new FormData(quoteForm),
          headers: {
            Accept: "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Quote request failed");
        }

        window.location.href = redirectUrl || "/thankyou.html";
      } catch (error) {
        if (feedback) {
          feedback.textContent = "Something went wrong sending your request. Please try again or call 0493 819 163.";
          feedback.classList.remove("is-success");
        }

        if (submitButton) {
          submitButton.classList.remove("is-submitting");
          submitButton.disabled = false;
          submitButton.textContent = "Send Quote Request";

          if (quoteForm.classList.contains("hero-quick-form")) {
            submitButton.textContent = "Get Fast Quote";
          }
        }
      }
    });
  }

  // === Reveal on scroll ===
  const revealTargets = document.querySelectorAll('[data-reveal]');

  if (revealTargets.length) {
    const show = (entry) => entry.target.classList.add('is-visible');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            show(entry);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      revealTargets.forEach((el) => observer.observe(el));
    } else {
      revealTargets.forEach((el) => show({ target: el }));
    }
  }

  // === Page fade overlay on scroll ===
  let scrollFadeTimeout = null;

  const handleScrollFade = () => {
    document.body.classList.add('scroll-fade-active');
    if (scrollFadeTimeout) clearTimeout(scrollFadeTimeout);
    scrollFadeTimeout = setTimeout(() => {
      document.body.classList.remove('scroll-fade-active');
    }, 180);
  };

  window.addEventListener('scroll', handleScrollFade, { passive: true });
});
