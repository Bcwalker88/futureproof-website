document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Script loaded");

  // === Smooth scroll + auto-select service ===
  const services = document.querySelectorAll(".service");
  const quoteSection = document.querySelector("#quote");
  const selectMenu = document.querySelector('select[name="service"]');

  services.forEach((service) => {
    service.addEventListener("click", (e) => {
      e.preventDefault();

      const selectedService = service.getAttribute("data-service");
      if (quoteSection) {
        quoteSection.scrollIntoView({ behavior: "smooth" });
      }

      setTimeout(() => {
        if (selectMenu && selectedService) {
          selectMenu.value = selectedService;
        }
      }, 600);
    });
  });

  // === Handle quote form submission (Formspree) ===
  const form = document.getElementById("quote-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const action = form.getAttribute("action");
    const redirectUrl = form.dataset.fsRedirect;

    try {
      const response = await fetch(action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        // If a redirect URL is provided, go there (thankyou page)
        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          showMessage(
            "✅ Thanks for your request! We will contact you soon."
          );
          form.reset();
        }
      } else {
        showMessage(
          "⚠️ There was an issue submitting your request. Please try again.",
          true
        );
      }
    } catch (error) {
      console.error(error);
      showMessage("❌ Network error. Please try again later.", true);
    }
  });

  // === Function to show temporary toast message ===
  function showMessage(message, isError = false) {
    const msgBox = document.createElement("div");
    msgBox.textContent = message;
    msgBox.style.position = "fixed";
    msgBox.style.top = "20px";
    msgBox.style.left = "50%";
    msgBox.style.transform = "translateX(-50%)";
    msgBox.style.padding = "15px 25px";
    msgBox.style.borderRadius = "6px";
    msgBox.style.fontWeight = "600";
    msgBox.style.zIndex = "9999";
    msgBox.style.background = isError ? "#dc3545" : "#28a745";
    msgBox.style.color = "white";
    msgBox.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
    msgBox.style.transition = "opacity 0.5s ease";

    document.body.appendChild(msgBox);

    setTimeout(() => {
      msgBox.style.opacity = "0";
      setTimeout(() => msgBox.remove(), 500);
    }, 2500);
  }
});
