/* ==========================================================================
   COFWO — gallery.js (used on /gallery/ only)
   Opens gallery photos in a full-screen viewer. Without JavaScript each
   thumbnail simply links to the full-size photo.
   Keys: ← → to move, Esc to close.
   ========================================================================== */
(function () {
  "use strict";
  var links = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  var dialog = document.getElementById("lightbox");
  if (!links.length || !dialog || typeof dialog.showModal !== "function") return;

  var img = dialog.querySelector("img");
  var caption = dialog.querySelector("figcaption");
  var count = dialog.querySelector(".lb-count");
  var current = 0;
  var lastFocus = null;

  function show(i) {
    current = (i + links.length) % links.length;
    var link = links[current];
    var thumb = link.querySelector("img");
    img.src = link.getAttribute("href");
    img.alt = thumb ? thumb.alt : "";
    caption.textContent = thumb ? thumb.alt : "";
    count.textContent = (current + 1) + " / " + links.length;
  }

  links.forEach(function (link, i) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      lastFocus = link;
      show(i);
      dialog.showModal();
    });
  });

  dialog.querySelector(".lb-prev").addEventListener("click", function () { show(current - 1); });
  dialog.querySelector(".lb-next").addEventListener("click", function () { show(current + 1); });
  dialog.querySelector(".lb-close").addEventListener("click", function () { dialog.close(); });
  dialog.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
  // Click on the dark backdrop closes the viewer
  dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener("close", function () {
    img.removeAttribute("src");
    if (lastFocus) lastFocus.focus();
  });

  // Simple swipe support on phones
  var startX = null;
  dialog.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
  dialog.addEventListener("touchend", function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  });
})();
