/* ==========================================================================
   YCALEX - Main JavaScript
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  // 1. Update copyright year automatically
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 2. Mobile navigation menu
  const menuToggle = document.getElementById("menu-toggle");
  const menuClose = document.getElementById("menu-close");
  const siteNav = document.getElementById("primary-navigation");

  function openMenu() {
    if (!siteNav || !menuToggle) return;
    siteNav.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    if (menuClose) {
      menuClose.focus();
    }
  }

  function closeMenu() {
    if (!siteNav || !menuToggle) return;
    siteNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    menuToggle.focus();
  }

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", openMenu);
  }

  if (menuClose && siteNav) {
    menuClose.addEventListener("click", closeMenu);
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && siteNav && siteNav.classList.contains("is-open")) {
      closeMenu();
    }
  });

  if (siteNav) {
    const navLinks = siteNav.querySelectorAll("a");
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (siteNav.classList.contains("is-open")) {
          closeMenu();
        }
      });
    });
  }

  // 3. Accessible client-side validation for Contact Form
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    const errorSummary = document.getElementById("form-error-summary");
    const firstNameInput = document.getElementById("first-name");
    const lastNameInput = document.getElementById("last-name");
    const emailInput = document.getElementById("email");
    const honeypotInput = contactForm.querySelector(".hp-field input");

    function setFieldError(input, errorId, message) {
      const errorElement = document.getElementById(errorId);
      if (!input || !errorElement) return;
      input.classList.add("has-error");
      input.setAttribute("aria-invalid", "true");
      errorElement.textContent = message;
    }

    function clearFieldError(input, errorId) {
      const errorElement = document.getElementById(errorId);
      if (!input || !errorElement) return;
      input.classList.remove("has-error");
      input.removeAttribute("aria-invalid");
      errorElement.textContent = "";
    }

    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    contactForm.addEventListener("submit", function (event) {
      // Silently block automated spam submissions
      if (honeypotInput && honeypotInput.value.trim() !== "") {
        event.preventDefault();
        return;
      }

      let isValid = true;
      let firstInvalidField = null;

      clearFieldError(firstNameInput, "first-name-error");
      clearFieldError(lastNameInput, "last-name-error");
      clearFieldError(emailInput, "email-error");

      if (firstNameInput && firstNameInput.value.trim() === "") {
        setFieldError(firstNameInput, "first-name-error", "Please enter your first name.");
        isValid = false;
        firstInvalidField = firstInvalidField || firstNameInput;
      }

      if (lastNameInput && lastNameInput.value.trim() === "") {
        setFieldError(lastNameInput, "last-name-error", "Please enter your last name.");
        isValid = false;
        firstInvalidField = firstInvalidField || lastNameInput;
      }

      if (emailInput) {
        const emailValue = emailInput.value.trim();
        if (emailValue === "") {
          setFieldError(emailInput, "email-error", "Please enter your email address.");
          isValid = false;
          firstInvalidField = firstInvalidField || emailInput;
        } else if (!isValidEmail(emailValue)) {
          setFieldError(emailInput, "email-error", "Please enter a valid email address.");
          isValid = false;
          firstInvalidField = firstInvalidField || emailInput;
        }
      }

      if (!isValid) {
        event.preventDefault();
        if (errorSummary) {
          errorSummary.textContent = "Please correct the highlighted fields below before submitting.";
          errorSummary.classList.add("is-visible");
        }
        if (firstInvalidField) {
          firstInvalidField.focus();
        }
      } else if (errorSummary) {
        errorSummary.textContent = "";
        errorSummary.classList.remove("is-visible");
      }
    });
  }
});