/* EwebVision — site scripts */
(function () {
  "use strict";

  var WHATSAPP_NUMBER = "918602372125";
  var EMAIL = "servicesewebvision@gmail.com";

  document.documentElement.classList.remove("no-js");

  /* Header: solid background after scrolling */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile navigation */
  var toggle = document.querySelector(".nav-toggle");
  if (toggle && header) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".main-nav a").forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && header.classList.contains("nav-open")) {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* Reveal-on-scroll animations */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Footer year */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* Enquiry form: sends via WhatsApp or email (no server needed) */
  var form = document.getElementById("enquiry-form");
  if (form) {
    var errorEl = form.querySelector(".form-error");

    function collect() {
      var data = {
        name: form.elements.name.value.trim(),
        phone: form.elements.phone.value.trim(),
        email: form.elements.email.value.trim(),
        service: form.elements.service.value,
        message: form.elements.message.value.trim()
      };
      if (!data.name || !data.phone || !data.message) {
        errorEl.textContent = "Please fill in your name, phone number and requirement.";
        errorEl.classList.add("show");
        return null;
      }
      errorEl.classList.remove("show");
      return data;
    }

    function buildMessage(d) {
      return [
        "Hello EwebVision, I have an enquiry.",
        "",
        "Name: " + d.name,
        "Phone: " + d.phone,
        d.email ? "Email: " + d.email : null,
        "Interested in: " + (d.service || "Not specified"),
        "",
        "Requirement: " + d.message
      ].filter(function (line) { return line !== null; }).join("\n");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = collect();
      if (!d) return;
      var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(buildMessage(d));
      window.open(url, "_blank", "noopener");
    });

    var emailBtn = form.querySelector("[data-send-email]");
    if (emailBtn) {
      emailBtn.addEventListener("click", function () {
        var d = collect();
        if (!d) return;
        var subject = "Project enquiry from " + d.name + (d.service ? " — " + d.service : "");
        window.location.href = "mailto:" + EMAIL +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(buildMessage(d));
      });
    }
  }
})();
