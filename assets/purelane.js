/* ============================================================
   PURELANE — INTERACTION
   Hero slider + Shopify Theme Editor support
   ============================================================ */

(function () {
  "use strict";

  const HERO_INTERVAL = 3800;

  function prefersReducedMotion() {
    return window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }

  function initPurelaneHero(root) {
    if (!root) {
      return;
    }

    /*
     * Shopify can re-render a section inside the Theme Editor.
     * Remove the old initialization marker when necessary.
     */
    if (root.dataset.heroInitialized === "true") {
      return;
    }

    root.dataset.heroInitialized = "true";

    const slides = Array.from(
      root.querySelectorAll("[data-hero-slide]")
    );

    const dots = Array.from(
      root.querySelectorAll("[data-hero-dot]")
    );

    if (!slides.length) {
      return;
    }

    let current = 0;
    let timer = null;

    function showSlide(index) {
      current =
        (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        const active = slideIndex === current;

        slide.classList.toggle(
          "is-active",
          active
        );

        slide.setAttribute(
          "aria-hidden",
          active ? "false" : "true"
        );
      });

      dots.forEach(function (dot, dotIndex) {
        const active = dotIndex === current;

        dot.classList.toggle(
          "is-active",
          active
        );

        dot.setAttribute(
          "aria-selected",
          active ? "true" : "false"
        );
      });
    }

    function stopAutoplay() {
      if (timer !== null) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function startAutoplay() {
      stopAutoplay();

      if (
        prefersReducedMotion() ||
        slides.length <= 1
      ) {
        return;
      }

      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, HERO_INTERVAL);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener(
        "click",
        function () {
          showSlide(index);
          startAutoplay();
        }
      );

      dot.addEventListener(
        "keydown",
        function (event) {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            showSlide(current + 1);
            dots[current]?.focus();
          }

          if (event.key === "ArrowLeft") {
            event.preventDefault();
            showSlide(current - 1);
            dots[current]?.focus();
          }
        }
      );
    });

    root.addEventListener(
      "mouseenter",
      stopAutoplay
    );

    root.addEventListener(
      "mouseleave",
      startAutoplay
    );

    root.addEventListener(
      "focusin",
      stopAutoplay
    );

    root.addEventListener(
      "focusout",
      function (event) {
        if (
          !root.contains(event.relatedTarget)
        ) {
          startAutoplay();
        }
      }
    );

    showSlide(0);
    startAutoplay();
  }

  function initAllPurelaneHeroes() {
    document
      .querySelectorAll(".purelane-hero-section")
      .forEach(initPurelaneHero);
  }

  /*
   * Initial page load
   */
  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initAllPurelaneHeroes
    );
  } else {
    initAllPurelaneHeroes();
  }

  /*
   * Shopify Theme Editor
   */
  document.addEventListener(
    "shopify:section:load",
    function (event) {
      const section = event.target;

      if (
        section &&
        section.classList.contains(
          "purelane-hero-section"
        )
      ) {
        initPurelaneHero(section);
      }
    }
  );

  /*
   * If the merchant removes/reloads a section,
   * stop anything belonging to the old DOM.
   */
  document.addEventListener(
    "shopify:section:unload",
    function (event) {
      const section = event.target;

      if (
        section &&
        section.classList.contains(
          "purelane-hero-section"
        )
      ) {
        section.dataset.heroInitialized =
          "false";
      }
    }
  );
})();