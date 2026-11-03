/* ==========================================================================
   COFWO — main.js
   Small enhancements only. Every page still works with JavaScript turned off.
     1. Mobile menu
     2. Header background on scroll
     3. Fade-in on scroll
     4. Forms (contact + newsletter) → Web3Forms
   ========================================================================== */
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");

  /* ---------- 1. Mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.querySelector(".nav-toggle__label").textContent = open ? "Close" : "Menu";
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
    // Close the menu if the screen is resized to desktop width
    window.matchMedia("(min-width: 960px)").addEventListener("change", function (mq) {
      if (mq.matches) setOpen(false);
    });
  }

  /* ---------- 2. Header background on scroll ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 40); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- 3. Fade-in on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  // Skip the animation for reduced-motion users and for automated screenshot tools
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches || /Headless/.test(navigator.userAgent);
  if (reveals.length && "IntersectionObserver" in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- 4. Forms ----------
     Forms post to Web3Forms (https://web3forms.com), which emails each
     submission to the ministry inbox. The public "access_key" lives in a
     hidden field inside each form. A success message is shown ONLY when
     Web3Forms confirms it received the message. */
  var PLACEHOLDER_KEY = "YOUR_WEB3FORMS_ACCESS_KEY";
  var FALLBACK_EMAIL = "info@thecofwo.org";

  function setError(field, message) {
    var errorEl = document.getElementById(field.id + "-error");
    field.setAttribute("aria-invalid", message ? "true" : "false");
    if (errorEl) errorEl.textContent = message || "";
  }

  function validateField(field) {
    var v = field.validity;
    var label = field.dataset.label || "This field";
    if (v.valueMissing) return label + " is required.";
    if (v.typeMismatch && field.type === "email") return "Please enter a valid email address, like name@example.com.";
    if (v.tooShort) return label + " is too short.";
    return "";
  }

  document.querySelectorAll("form[data-web3forms]").forEach(function (form) {
    var status = form.querySelector(".form-status");
    var button = form.querySelector("button[type=submit]");
    var buttonText = button ? button.innerHTML : "";
    var fields = form.querySelectorAll("input[required], textarea[required]");

    form.setAttribute("novalidate", "");
    fields.forEach(function (field) {
      field.addEventListener("blur", function () {
        if (field.value) setError(field, validateField(field));
      });
      field.addEventListener("input", function () {
        if (field.getAttribute("aria-invalid") === "true") setError(field, validateField(field));
      });
    });

    function showStatus(type, html) {
      status.className = "form-status form-status--" + type;
      status.innerHTML = html;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstBad = null;
      fields.forEach(function (field) {
        var msg = validateField(field);
        setError(field, msg);
        if (msg && !firstBad) firstBad = field;
      });
      if (firstBad) { firstBad.focus(); return; }

      var data = new FormData(form);
      if (data.get("botcheck")) return; // spam trap was filled in by a bot

      if (!data.get("access_key") || data.get("access_key") === PLACEHOLDER_KEY) {
        showStatus("error", "Sorry, this form is not connected yet. Please email us at <a href=\"mailto:" + FALLBACK_EMAIL + "\">" + FALLBACK_EMAIL + "</a>.");
        return;
      }

      // Web3Forms: a combined name is easier to read in the inbox
      if (data.get("first_name") || data.get("last_name")) {
        data.set("name", ((data.get("first_name") || "") + " " + (data.get("last_name") || "")).trim());
      }
      data.delete("redirect"); // only used when JavaScript is off

      button.disabled = true;
      button.textContent = "Sending…";
      showStatus("pending", "Sending your message…");

      fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data
      })
        .then(function (res) { return res.json().then(function (json) { return { ok: res.ok, json: json }; }); })
        .then(function (r) {
          if (r.ok && r.json && r.json.success) {
            showStatus("success", form.dataset.success || "Thank you. Your message has been sent.");
            form.reset();
          } else {
            throw new Error((r.json && r.json.message) || "Submission failed");
          }
        })
        .catch(function () {
          showStatus("error", "Sorry, something went wrong and your message was not sent. Please try again, or email us at <a href=\"mailto:" + FALLBACK_EMAIL + "\">" + FALLBACK_EMAIL + "</a>.");
        })
        .finally(function () {
          button.disabled = false;
          button.innerHTML = buttonText;
          status.focus();
        });
    });
  });
})();
